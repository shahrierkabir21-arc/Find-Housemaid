import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EmployerService } from './employer.service';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto } from './dto/update-employer.dto';
import { CreateJobRequestDto } from './dto/create-job-request.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { EmployerValidationPipe } from './pipes/employer-validation.pipe';
import { PositiveIntPipe } from '../common/pipes/positive-int.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';

@Controller('employers')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Post('register')
  register(
    @Body(new EmployerValidationPipe()) createEmployerDto: CreateEmployerDto,
  ) {
    return this.employerService.register(createEmployerDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYER)
  getProfile(@Param('id', PositiveIntPipe) id: number) {
    return this.employerService.getProfile(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYER)
  updateProfile(
    @Param('id', PositiveIntPipe) id: number,
    @Body() updateEmployerDto: UpdateEmployerDto,
  ) {
    return this.employerService.updateProfile(id, updateEmployerDto);
  }

  @Post(':id/job-requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  createJobRequest(
    @Param('id', PositiveIntPipe) id: number,
    @Body() createJobRequestDto: CreateJobRequestDto,
  ) {
    return this.employerService.createJobRequest(id, createJobRequestDto);
  }

  @Get(':id/job-requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYER)
  getJobRequests(@Param('id', PositiveIntPipe) id: number) {
    return this.employerService.getJobRequests(id);
  }

  @Get(':id/bookings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYER)
  getBookings(@Param('id', PositiveIntPipe) id: number) {
    return this.employerService.getBookings(id);
  }

  @Patch('bookings/:bookingId/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  confirmBooking(@Param('bookingId', PositiveIntPipe) bookingId: number) {
    return this.employerService.confirmBooking(bookingId);
  }

  @Post('bookings/:bookingId/reviews')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  createReview(
    @Param('bookingId', PositiveIntPipe) bookingId: number,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.employerService.createReview(bookingId, createReviewDto);
  }

  @Delete('job-requests/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  deleteJobRequest(@Param('id', PositiveIntPipe) id: number) {
    return this.employerService.deleteJobRequest(id);
  }
}