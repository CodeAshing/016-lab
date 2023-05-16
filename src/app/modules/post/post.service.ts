import { getPostUnitDTO } from './dto/get-Post-unit.dto';
import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, Model } from 'mongoose';
import { connectionEnum } from 'src/app/common/enum';

import { responseEnum } from './enum';
import { Post, PostDocument } from './schema';
import { Unit, UnitDocument } from '../unit/schema';
import { PostDTO, InProgressDTO, UnPostDTO } from './dto';
import { Status, StatusDocument } from '../status/schema';
import { Employers, EmployersDocument } from '../user/schema';

import { Helper } from 'src/app/common/helper/utilities.helper';
import { Types } from 'mongoose';
import { Log, LogDocument } from 'src/app/schema';
const helper = new Helper();

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name, connectionEnum.ERP)
    private readonly PostModel: Model<PostDocument>,

    @InjectModel(Status.name, connectionEnum.ERP)
    private readonly statusModel: Model<StatusDocument>,

    @InjectModel(Unit.name, connectionEnum.ERP)
    private readonly unitModel: Model<UnitDocument>,

    @InjectModel(Log.name, connectionEnum.ERP)
    private readonly logModel: Model<LogDocument>,

    @InjectModel(Employers.name, connectionEnum.SHORELINE)
    private readonly employerModel: Model<EmployersDocument>,

    @InjectConnection(connectionEnum.ERP)
    private readonly erp_connection: Connection,
  ) { }

  async getPostUnit({ unit_id }: getPostUnitDTO): Promise<any> {
    const { Posters, employees_id } = await Promise.all([
      this.PostModel.find({
        unit_id: new Types.ObjectId(unit_id),
        validity: { $gte: new Date() },
      }),
      this.PostModel
        .find({
          unit_id: new Types.ObjectId(unit_id),
          validity: { $gte: new Date() },
        })
        .distinct('staff'),
    ])
      .then((data) => {
        return { Posters: data[0], employees_id: data[1] };
      })
      .catch((e) => {
        throw new InternalServerErrorException(e);
      });

    if (!Posters.length) throw new NotFoundException(responseEnum.NO_PostERS);

    const employee = await this.employerModel
      .aggregate([
        {
          $match: {
            $and: [{ _id: { $in: employees_id } }],
          },
        },
        {
          $lookup: {
            from: 'regions',
            localField: 'region',
            foreignField: '_id',
            as: 'region',
          },
        },
        {
          $unwind: {
            path: '$region',
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .catch((e) => {
        throw new InternalServerErrorException(e);
      });

    const transformEmployeeObject = helper.transformObjectToKey(
      employee,
      '_id',
    );

    const updatedPosters = Posters.map((Poster) => {
      Poster = Poster['_doc'];
      Poster.staff = transformEmployeeObject[Poster.staff.toString()];
      return Poster;
    });

    return updatedPosters;
  }

  async inProgress(
    unit_id: string,
    inProgressFor: string,
    validity: Date,
    employee: any,
  ): Promise<any> {
    const unit = await this.unitModel
      .aggregate([
        {
          $match: {
            $and: [{ _id: new Types.ObjectId(unit_id) }],
          },
        },
        {
          $lookup: {
            from: 'status',
            localField: 'status',
            foreignField: '_id',
            as: 'status',
          },
        },
        {
          $unwind: {
            path: '$status',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $project: { status: 1 } },
      ])
      .catch((e) => {
        throw new InternalServerErrorException(e);
      });

    if (!unit.length) throw new NotFoundException(responseEnum.UNIT_NOT_FOUND);

    if (
      unit[0].status.stage !== 0 ||
      (unit[0].status.stage === 0 &&
        (unit[0].status.level > 1 || unit[0].status.level < -1))
    )
      throw new ConflictException(
        responseEnum.YOU_CAN_NOT_PROCEED_WITH_THIS_UNIT,
      );

    const inProgressForStatusId = await this.statusModel.exists({
      slug: inProgressFor,
    });

    const { Posters, inProgressStatus } = await Promise.all([
      this.PostModel
        .find({
          unit_id: new Types.ObjectId(unit_id),
          validity: { $gte: new Date() },
        })
        .distinct('_id'),
      this.statusModel.findOne({
        stage: 0,
        level: -2,
      }),
    ])
      .then((data) => {
        return { Posters: data[0], inProgressStatus: data[1] };
      })
      .catch((e) => {
        throw new InternalServerErrorException(e);
      });

    if (!inProgressStatus)
      throw new NotFoundException(responseEnum.INPROGRESS_STATUS_NOT_FOUND);

    await Promise.all([
      this.unitModel.updateOne(
        {
          _id: new Types.ObjectId(unit_id),
        },
        { status: inProgressStatus._id },
      ),
      this.PostModel.updateMany(
        { _id: { $in: Posters } },
        { validity: new Date() },
      ),
      this.PostModel.create({
        unit_id: new Types.ObjectId(unit_id),
        status_id: inProgressStatus._id,
        inProgressFor: inProgressFor,
        staff: employee._id,
        validity: validity,
      }),
    ])
      .then((data) => {
        return { Posters: data[0], inProgressStatus: data[1] };
      })
      .catch((e) => {
        throw new InternalServerErrorException(e);
      });

    return null;
  }

  async PostUnit({ unit_id, validity }: PostDTO, employee: any): Promise<any> {
    const unit = await this.unitModel
      .aggregate([
        {
          $match: {
            $and: [{ _id: new Types.ObjectId(unit_id) }],
          },
        },
        {
          $lookup: {
            from: 'status',
            localField: 'status',
            foreignField: '_id',
            as: 'status',
          },
        },
        {
          $unwind: {
            path: '$status',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $project: { status: 1 } },
      ])
      .catch((e) => {
        throw new InternalServerErrorException(e);
      });

    if (!unit.length) throw new NotFoundException(responseEnum.UNIT_NOT_FOUND);

    if (
      unit[0].status.stage !== 0 ||
      (unit[0].status.stage === 0 &&
        (unit[0].status.level > 1 || unit[0].status.level < -1))
    )
      throw new ConflictException(
        responseEnum.YOU_CAN_NOT_PROCEED_WITH_THIS_UNIT,
      );

    const isPost = await this.statusModel
      .findOne({
        stage: 0,
        level: 1,
      })
      .catch((e) => {
        throw new InternalServerErrorException(e);
      });

    if (!isPost)
      throw new NotFoundException(responseEnum.Post_STATUS_NOT_FOUND);

    const Posters = await this.PostModel
      .find(
        {
          unit_id: new Types.ObjectId(unit_id),
          validity: { $gte: new Date() },
        },
        { staff: 1 },
      )
      .catch((e) => {
        throw new InternalServerErrorException(e);
      });

    if (Posters.some((Poster) => String(Poster.staff) === String(employee._id)))
      throw new ConflictException(responseEnum.ALREADY_HELD);

    if (Posters.length === 2)
      throw new ConflictException(responseEnum.PostERS_EXISTS);

    const Post_id = new Types.ObjectId();

    const session = await this.erp_connection.startSession();
    session.startTransaction();
    try {
      await this.PostModel
        .create(
          [
            {
              _id: Post_id,
              unit_id: new Types.ObjectId(unit_id),
              status_id: isPost._id,
              staff: employee._id,
              validity: validity,
            },
          ],
          { session: session },
        )
        .catch((e) => {
          throw new InternalServerErrorException(e);
        });

      //change unit status to Post only if no Poster exists
      if (!Posters.length)
        await this.unitModel
          .updateOne(
            {
              _id: unit_id,
            },
            { status: isPost._id },
            { session: session },
          )
          .catch((e) => {
            throw new InternalServerErrorException(e);
          });

      // Save Log --- Start
      await helper
        .insertLog(
          {
            record_id: Post_id,
            user: employee._id,
            status: 'Post',
            event: 'created',
            description: 'Post has been created',
          },
          this.logModel,
          session,
        )
        .then((resp) => {
          if (resp.success === false) throw new HttpException(resp.msg, 500);
        });
      // Save Log --- End

      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();

      throw new HttpException(e.response.message, e.status);
    } finally {
      await session.endSession();
    }

    return { Post_id };
  }

  async unPostUnit({ Post_id }: UnPostDTO, employee: any): Promise<any> {
    const Posters = await this.PostModel
      .findOne(
        {
          _id: new Types.ObjectId(Post_id),
          staff: employee._id,
          validity: { $gte: new Date() },
        },
        { unit_id: 1 },
      )
      .catch((e) => {
        throw new InternalServerErrorException(e);
      });

    if (!Posters)
      throw new NotFoundException(responseEnum.Post_NOT_FOUND_OR_NOT_HELD);

    const unit = await this.unitModel
      .findOne(
        {
          _id: Posters.unit_id,
        },
        { sale: 1 },
      )
      .catch((e) => {
        throw new InternalServerErrorException(e);
      });
    if (!unit) throw new NotFoundException(responseEnum.UNIT_NOT_FOUND);

    if (unit.sale)
      throw new ConflictException(responseEnum.SALES_ALREADY_EXIST);

    const availableStatus = await this.statusModel
      .findOne({
        stage: 0,
        level: 0,
      })
      .catch((e) => {
        throw new InternalServerErrorException(e);
      });

    if (!availableStatus)
      throw new NotFoundException(responseEnum.AVAILABLE_STATUS_NOT_FOUND);

    const allPosters = await this.PostModel
      .find({
        unit_id: Posters.unit_id,
        validity: { $gte: new Date() },
      })
      .catch((e) => {
        throw new InternalServerErrorException(e);
      });
    console.log(allPosters.length);

    if (allPosters.length === 1)
      await this.unitModel
        .updateOne(
          {
            _id: Posters.unit_id,
          },
          { status: availableStatus._id },
        )
        .catch((e) => {
          throw new InternalServerErrorException(e);
        });

    //update validity to current time
    await this.PostModel
      .updateOne(
        {
          _id: new Types.ObjectId(Post_id),
          unit_id: Posters.unit_id,
          staff: employee._id,
        },
        { validity: new Date() },
      )
      .catch((e) => {
        throw new InternalServerErrorException(e);
      });

    return null;
  }
}
