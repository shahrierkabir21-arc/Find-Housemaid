import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { VerifyHousemaidDto } from './dto/verify-housemaid.dto';
import { AssignBookingDto } from './dto/assign-booking.dto';
import { CreateAdminValidationPipe } from './pipes/create-admin-validation.pipe';
import { FileImageValidationPipe } from '../common/pipes/file-image-validation.pipe';
import { PositiveIntPipe } from '../common/pipes/positive-int.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('nidImage'))
  createAdmin(
    @Body(new CreateAdminValidationPipe()) createAdminDto: CreateAdminDto,
    @UploadedFile(new FileImageValidationPipe()) nidImage: any,
  ) {
    return this.adminService.createAdmin(createAdminDto, nidImage);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getProfile(@Req() req: any) {
    return this.adminService.getProfile(req.user.id);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Put('users/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateUserStatus(
    @Param('id', PositiveIntPipe) id: number,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateUserStatus(id, updateUserStatusDto);
  }

  @Patch('housemaids/:id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  verifyHousemaid(
    @Param('id', PositiveIntPipe) id: number,
    @Body() verifyHousemaidDto: VerifyHousemaidDto,
  ) {
    return this.adminService.verifyHousemaid(id, verifyHousemaidDto);
  }

  @Post('bookings/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  assignHousemaidToJob(
    @Req() req: any,
    @Body() assignBookingDto: AssignBookingDto,
  ) {
    return this.adminService.assignHousemaidToJob(
      req.user.id,
      assignBookingDto,
    );
  }

  @Get('job-requests/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getPendingJobRequests() {
    return this.adminService.getPendingJobRequests();
  }

  @Get('payments/report')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getPaymentReport() {
    return this.adminService.getPaymentReport();
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteUser(@Param('id', PositiveIntPipe) id: number) {
    return this.adminService.deleteUser(id);
  }
}