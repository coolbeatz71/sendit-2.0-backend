import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { Parcel } from '../../database/models/Parcel';
import helper from '../../helpers';
import { arrayStatus, Status } from './../../interfaces/models.interface';
import { validationResult } from 'express-validator';

export class Admin {
  /**
   * get All parcels for all users
   * @description requires admin token
   * @param  Request req
   * @param  Response res
   * @return object json
   */
  public async getAllParcels(_req: Request, res: Response) {
    try {
      const data = await Parcel.find();
      return helper.getResponse(res, httpStatus.OK, { data });
    } catch (error) {
      return helper.getServerError(res, error.message);
    }
  }

  /**
   * update the parcel status
   * @description requires admin token
   * @param  Request req
   * @param  Response res
   * @return object json
   */
  public async updateParcelStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    await helper.validateEmpty(req, 'status', 'new status');

    const errors = validationResult(req);
    if (!errors.isEmpty()) return helper.getValidationError(res, errors);

    if (!helper.isValidId(id)) {
      return helper.getResponse(res, httpStatus.BAD_REQUEST, {
        message: 'The query params is invalid',
      });
    }

    if (!arrayStatus.includes(status)) {
      return helper.getResponse(res, httpStatus.BAD_REQUEST, {
        message: 'Invalid value for the status',
      });
    }

    try {
      const parcel = await Parcel.findOne({ status, _id: id });
      if (parcel) {
        return helper.getResponse(res, httpStatus.BAD_REQUEST, {
          message: 'the new status must be different from the old',
        });
      }
      const data = await Parcel.findOneAndUpdate({ _id: id }, { status }, { new: true });
      if (!data) return helper.getServerError(res, 'Failed to update the parcel status');

      return helper.getResponse(res, httpStatus.OK, {
        data,
        message: 'Parcel status successfully updated',
      });
    } catch (error) {
      return helper.getServerError(res, error.message);
    }
  }

  /**
   * update the parcel present location
   * @description requires admin token
   * @param  Request req
   * @param  Response res
   * @return object json
   */
  public async updateParcelLocation(req: Request, res: Response) {
    const { id } = req.params;
    const { presentLocation } = req.body;

    await helper.validateEmpty(req, 'presentLocation', 'new present location');

    const errors = validationResult(req);
    if (!errors.isEmpty()) return helper.getValidationError(res, errors);

    if (!helper.isValidId(id)) {
      return helper.getResponse(res, httpStatus.BAD_REQUEST, {
        message: 'The query params is invalid',
      });
    }

    try {
      const parcel = await Parcel.findOne({ _id: id });

      if (!parcel) {
        return helper.getResponse(res, httpStatus.NOT_FOUND, {
          message: 'No parcel was found',
        });
      }

      if (parcel.presentLocation === presentLocation) {
        return helper.getResponse(res, httpStatus.BAD_REQUEST, {
          message: 'the new present location must be different from the old',
        });
      }

      const { destination } = parcel;

      // if presentLocation is equal to destination then status should be `delivered`
      // else status should be transiting
      const newStatus: string =
        presentLocation === destination ? Status.DELIVERED : Status.TRANSITING;

      const data = await Parcel.findOneAndUpdate(
        { _id: id },
        { presentLocation, status: newStatus },
        { new: true },
      );

      return helper.getResponse(res, httpStatus.OK, {
        data,
        message: 'Parcel present location successfully updated',
      });
    } catch (error) {
      return helper.getServerError(res, error.message);
    }
  }

  /**
   * count the number of parcel per status
   * @description requires admin token
   * @param  Request req
   * @param  Response res
   * @return object json
   */
  public async countParcels(_req: Request, res: Response) {
    try {
      const pending = await Parcel.find({ status: Status.PENDING }).countDocuments();
      const transiting = await Parcel.find({ status: Status.TRANSITING }).countDocuments();
      const delivered = await Parcel.find({ status: Status.DELIVERED }).countDocuments();
      const cancelled = await Parcel.find({ status: Status.CANCELLED }).countDocuments();

      return helper.getResponse(res, httpStatus.OK, {
        data: { pending, transiting, delivered, cancelled },
      });
    } catch (error) {
      return helper.getServerError(res, error.message);
    }
  }
}

const adminCtrl = new Admin();
export default adminCtrl;
