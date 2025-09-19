import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { UpdateEnrollmentDto } from "./dto/update-enrollment.dto";
import { EnrollmentService } from "./enrollment.service";

@Controller("enrollment")
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  create(@Query("courseId") courseId: string, @Query("userId") userId: string) {
    // You may want to use courseId in your service call or logic
    return this.enrollmentService.enroll(userId, courseId);
  }

  @Get()
  findAll() {
    return this.enrollmentService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.enrollmentService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto
  ) {
    return this.enrollmentService.update(+id, updateEnrollmentDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.enrollmentService.remove(+id);
  }
}
