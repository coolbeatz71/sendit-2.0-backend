import httpStatus from 'http-status';
import { validationResult } from 'express-validator';
import { Response, Request } from 'express';
import helper from './../../helpers';
import { Parcel } from './../../database/models/Parcel';
import { IParcel, IUserUpdateParcel, Status } from './../../interfaces/models.interface';

export class Parcels {
  /**
   * get All parcels for all users
   * @description requires admin token
   * @param  Request req
   * @param  Response res
   * @return object json
   */
  public async getAll(_req: Request, res: Response) {
    try {
      const data = await Parcel.find();
      return helper.getResponse(res, httpStatus.OK, { data });
    } catch (error) {
      return helper.getServerError(res, error.message);
    }
  }

  /**
   * get All parcels for a private user
   * @description requires user token and id
   * @param  Request req
   * @param  Response res
   * @return object json
   */
  public async getAllPrivate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { _id }: any = req.user;
      if (!helper.isValidId(id)) {
        return helper.getResponse(res, httpStatus.BAD_REQUEST, {
          message: 'The query params is invalid',
        });
      }

      if (helper.isValidId(id) && id !== _id) {
        return helper.getResponse(res, httpStatus.FORBIDDEN, {
          message: 'Access forbidden: parcels are private',
        });
      }
      const data = await Parcel.find({ userId: _id });
      return helper.getResponse(res, httpStatus.OK, { data });
    } catch (error) {
      return helper.getServerError(res, error.message);
    }
  }

  /**
   * create a parcel by the user
   * @description requires user token
   * @param  Request req
   * @param  Response res
   * @return object json
   */
  public async create(req: Request, res: Response) {
    const { _id }: any = req.user;
    const { parcelName, description, pickupLocation, destination, weight } = req.body;
    await helper.validateEmpty(req, 'parcelName', 'parcel name');
    await helper.validateEmpty(req, 'description', 'description');
    await helper.validateEmpty(req, 'pickupLocation', 'pickup location');
    await helper.validateEmpty(req, 'destination', 'destination');
    await helper.validateWeight(req, 'weight');

    const errors = validationResult(req);
    if (!errors.isEmpty()) return helper.getValidationError(res, errors);

    const price = helper.getParcelPrice(weight);
    const presentLocation = pickupLocation;

    try {
      const parcelObj: IParcel = {
        parcelName,
        description,
        pickupLocation,
        presentLocation,
        destination,
        weight,
        price,
        userId: _id,
      };
      const newParcel = new Parcel(parcelObj);
      newParcel.save((err: Error, data: any) => {
        if (err) return helper.getServerError(res, err.message);
        return helper.getResponse(res, httpStatus.CREATED, {
          data,
          message: 'Parcel was successfully created',
        });
      });
    } catch (error) {
      return helper.getServerError(res, error.message);
    }
  }

  /**
   * update parcel informations
   * @description requires user token
   * @param  Request req
   * @param  Response res
   * @return object json
   */
  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { _id }: any = req.user;

    await helper.validateUpdateParcel(req, 'parcelName');
    await helper.validateUpdateParcel(req, 'description');
    await helper.validateUpdateParcel(req, 'pickupLocation');
    await helper.validateUpdateParcel(req, 'destination');
    await helper.validateUpdateParcel(req, 'weight');

    const { parcelName, description, pickupLocation, destination, weight } = req.body;

    const parcel: IUserUpdateParcel = {
      parcelName,
      description,
      pickupLocation,
      destination,
      weight,
      presentLocation: pickupLocation,
    };

    // clean and remove keys with undefined values
    const safeParcel = helper.getSanitizedBody(parcel);

    if (Object.entries(req.body).length === 0) {
      return helper.getResponse(res, httpStatus.BAD_REQUEST, {
        message: 'The request body cannot be empty',
      });
    }

    if (Object.entries(safeParcel).length === 0) {
      return helper.getResponse(res, httpStatus.BAD_REQUEST, {
        message: 'Fail to update the parcel',
      });
    }

    if (!helper.isValidId(id)) {
      return helper.getResponse(res, httpStatus.BAD_REQUEST, {
        message: 'The query params is invalid',
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) return helper.getValidationError(res, errors);
    try {
      // update the parcel with new data
      // only update pending parcel
      Parcel.findOneAndUpdate(
        { _id: id, userId: _id, status: Status.PENDING },
        safeParcel,
        { new: true },
        (err, data: any) => {
          if (err) return helper.getServerError(res, err.message);

          return !data
            ? helper.getResponse(res, httpStatus.NOT_FOUND, {
                message: 'No pending parcel was found',
              })
            : helper.getResponse(res, httpStatus.OK, {
                data,
                message: 'Parcel successfully updated',
              });
        },
      );
    } catch (error) {
      return helper.getServerError(res, error.message);
    }
  }

  /**
   * get one parcel by Id
   * @description requires user token
   * @param  Request req
   * @param  Response res
   * @return object json
   */
  public async getById(req: Request, res: Response) {
    const { id } = req.params;
    const { _id }: any = req.user;

    if (!helper.isValidId(id)) {
      return helper.getResponse(res, httpStatus.BAD_REQUEST, {
        message: 'The query params is invalid',
      });
    }

    try {
      const data = await Parcel.findOne({ _id: id, userId: _id });

      return !data
        ? helper.getResponse(res, httpStatus.NOT_FOUND, {
            message: 'No parcel information was found',
          })
        : helper.getResponse(res, httpStatus.OK, { data });
    } catch (error) {
      return helper.getServerError(res, error.message);
    }
  }

  /**
   * cancel a pending parcel by its Id
   * @description requires user token
   * @param  Request req
   * @param  Response res
   * @return object json
   */
  public async cancel(req: Request, res: Response) {
    const { id } = req.params;
    const { _id }: any = req.user;

    if (!helper.isValidId(id)) {
      return helper.getResponse(res, httpStatus.BAD_REQUEST, {
        message: 'The query params is invalid',
      });
    }

    try {
      // update the parcel status
      // only update pending parcel
      const data = await Parcel.findOneAndUpdate(
        { _id: id, userId: _id, status: Status.PENDING },
        { status: Status.CANCELLED },
        { new: true },
      );
      return !data
        ? helper.getResponse(res, httpStatus.NOT_FOUND, {
            message: 'can only cancel pending parcels',
          })
        : helper.getResponse(res, httpStatus.OK, {
            message: 'Parcel successfully cancelled',
          });
    } catch (error) {
      return helper.getServerError(res, error.message);
    }
  }

  /**
   * delete a cancelled or a pending parcel by the user
   * @description requires user token
   * @param  Request req
   * @param  Response res
   * @return object json
   */
  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    const { _id }: any = req.user;

    if (!helper.isValidId(id)) {
      return helper.getResponse(res, httpStatus.BAD_REQUEST, {
        message: 'The query params is invalid',
      });
    }

    try {
      const data = await Parcel.findOne({ _id: id, userId: _id });

      if (!data) {
        return helper.getResponse(res, httpStatus.NOT_FOUND, {
          message: 'No parcel was found',
        });
      }

      if (data.status === Status.PENDING || data.status === Status.CANCELLED) {
        const deleted = await Parcel.findOneAndDelete(
          { _id: id, userId: _id },
        );

        if(deleted) {
          return helper.getResponse(res, httpStatus.OK, {
            message: 'Parcel successfully deleted',
          });
        }
      }

      return helper.getResponse(res, httpStatus.FORBIDDEN, {
        message: 'Cannot delete parcel if it is in transit or delivered',
      });
    } catch (error) {
      return helper.getServerError(res, error.message);
    }
  }
}

const parcel = new Parcels();
export default parcel;
