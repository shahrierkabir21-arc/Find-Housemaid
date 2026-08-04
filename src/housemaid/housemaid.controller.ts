import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HousemaidService } from './housemaid.service';
import { CreateHousemaidDto } from './dto/create-housemaid.dto';
import { UpdateHousemaidDto } from './dto/update-housemaid.dto';
import { RespondBookingDto } from './dto/respond-booking.dto';
import { HousemaidValidationPipe } from './pipes/housemaid-validation.pipe';
import { FileImageValidationPipe } from '../common/pipes/file-image-validation.pipe';
import { PositiveIntPipe } from '../common/pipes/positive-int.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';

@Controller('housemaids')
export class HousemaidController {
  constructor(private readonly housemaidService: HousemaidService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('nidImage'))
  register(
    @Body(new HousemaidValidationPipe())
    createHousemaidDto: CreateHousemaidDto,
    @UploadedFile(new FileImageValidationPipe())
    nidImage: any,
  ) {
    return this.housemaidService.register(createHousemaidDto, nidImage);
  }

  @Get('approved/list')
  getApprovedHousemaids() {
    return this.housemaidService.getApprovedHousemaids();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.HOUSEMAID)
  getProfile(@Param('id', PositiveIntPipe) id: number) {
    return this.housemaidService.getProfile(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.HOUSEMAID)
  updateProfile(
    @Param('id', PositiveIntPipe) id: number,
    @Body() updateHousemaidDto: UpdateHousemaidDto,
  ) {
    return this.housemaidService.updateProfile(id, updateHousemaidDto);
  }

  @Post(':id/skills')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOUSEMAID)
  addSkill(
    @Param('id', PositiveIntPipe) id: number,
    @Body('skillName') skillName: string,
  ) {
    return this.housemaidService.addSkill(id, skillName);
  }

  @Delete(':housemaidId/skills/:skillId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOUSEMAID)
  removeSkill(
    @Param('housemaidId', PositiveIntPipe) housemaidId: number,
    @Param('skillId', PositiveIntPipe) skillId: number,
  ) {
    return this.housemaidService.removeSkill(housemaidId, skillId);
  }

  @Get(':id/jobs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOUSEMAID)
  getAssignedJobs(@Param('id', PositiveIntPipe) id: number) {
    return this.housemaidService.getAssignedJobs(id);
  }

  @Patch('bookings/:bookingId/respond')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOUSEMAID)
  respondBooking(
    @Param('bookingId', PositiveIntPipe) bookingId: number,
    @Body() respondBookingDto: RespondBookingDto,
  ) {
    return this.housemaidService.respondBooking(bookingId, respondBookingDto);
  }

  @Patch(':id/availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOUSEMAID)
  updateAvailability(
    @Param('id', PositiveIntPipe) id: number,
    @Body('availability') availability: string,
  ) {
    return this.housemaidService.updateAvailability(id, availability);
  }
}