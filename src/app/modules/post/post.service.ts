import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { responseEnum } from './enum';

import { Helper } from 'src/app/common/helper/utilities.helper';
const helper = new Helper();

@Injectable()
export class PostService {
  constructor() {}

  // async getPostUnit({ unit_id }: getPostUnitDTO): Promise<any> {
  //   const { Posters, employees_id } = await Promise.all([
  //     this.PostModel.find({
  //       unit_id: new Types.ObjectId(unit_id),
  //       validity: { $gte: new Date() },
  //     }),
  //     this.PostModel
  //       .find({
  //         unit_id: new Types.ObjectId(unit_id),
  //         validity: { $gte: new Date() },
  //       })
  //       .distinct('staff'),
  //   ])
  //     .then((data) => {
  //       return { Posters: data[0], employees_id: data[1] };
  //     })
  //     .catch((e) => {
  //       throw new InternalServerErrorException(e);
  //     });

  //   if (!Posters.length) throw new NotFoundException(responseEnum.NO_PostERS);

  //   const employee = await this.employerModel
  //     .aggregate([
  //       {
  //         $match: {
  //           $and: [{ _id: { $in: employees_id } }],
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: 'regions',
  //           localField: 'region',
  //           foreignField: '_id',
  //           as: 'region',
  //         },
  //       },
  //       {
  //         $unwind: {
  //           path: '$region',
  //           preserveNullAndEmptyArrays: true,
  //         },
  //       },
  //     ])
  //     .catch((e) => {
  //       throw new InternalServerErrorException(e);
  //     });

  //   const transformEmployeeObject = helper.transformObjectToKey(
  //     employee,
  //     '_id',
  //   );

  //   const updatedPosters = Posters.map((Poster) => {
  //     Poster = Poster['_doc'];
  //     Poster.staff = transformEmployeeObject[Poster.staff.toString()];
  //     return Poster;
  //   });

  //   return updatedPosters;
  // }

  // async inProgress(
  //   unit_id: string,
  //   inProgressFor: string,
  //   validity: Date,
  //   employee: any,
  // ): Promise<any> {
  //   const unit = await this.unitModel
  //     .aggregate([
  //       {
  //         $match: {
  //           $and: [{ _id: new Types.ObjectId(unit_id) }],
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: 'status',
  //           localField: 'status',
  //           foreignField: '_id',
  //           as: 'status',
  //         },
  //       },
  //       {
  //         $unwind: {
  //           path: '$status',
  //           preserveNullAndEmptyArrays: true,
  //         },
  //       },
  //       { $project: { status: 1 } },
  //     ])
  //     .catch((e) => {
  //       throw new InternalServerErrorException(e);
  //     });

  //   if (!unit.length) throw new NotFoundException(responseEnum.UNIT_NOT_FOUND);

  //   if (
  //     unit[0].status.stage !== 0 ||
  //     (unit[0].status.stage === 0 &&
  //       (unit[0].status.level > 1 || unit[0].status.level < -1))
  //   )
  //     throw new ConflictException(
  //       responseEnum.YOU_CAN_NOT_PROCEED_WITH_THIS_UNIT,
  //     );

  //   const inProgressForStatusId = await this.statusModel.exists({
  //     slug: inProgressFor,
  //   });

  //   const { Posters, inProgressStatus } = await Promise.all([
  //     this.PostModel
  //       .find({
  //         unit_id: new Types.ObjectId(unit_id),
  //         validity: { $gte: new Date() },
  //       })
  //       .distinct('_id'),
  //     this.statusModel.findOne({
  //       stage: 0,
  //       level: -2,
  //     }),
  //   ])
  //     .then((data) => {
  //       return { Posters: data[0], inProgressStatus: data[1] };
  //     })
  //     .catch((e) => {
  //       throw new InternalServerErrorException(e);
  //     });

  //   if (!inProgressStatus)
  //     throw new NotFoundException(responseEnum.INPROGRESS_STATUS_NOT_FOUND);

  //   await Promise.all([
  //     this.unitModel.updateOne(
  //       {
  //         _id: new Types.ObjectId(unit_id),
  //       },
  //       { status: inProgressStatus._id },
  //     ),
  //     this.PostModel.updateMany(
  //       { _id: { $in: Posters } },
  //       { validity: new Date() },
  //     ),
  //     this.PostModel.create({
  //       unit_id: new Types.ObjectId(unit_id),
  //       status_id: inProgressStatus._id,
  //       inProgressFor: inProgressFor,
  //       staff: employee._id,
  //       validity: validity,
  //     }),
  //   ])
  //     .then((data) => {
  //       return { Posters: data[0], inProgressStatus: data[1] };
  //     })
  //     .catch((e) => {
  //       throw new InternalServerErrorException(e);
  //     });

  //   return null;
  // }
}
