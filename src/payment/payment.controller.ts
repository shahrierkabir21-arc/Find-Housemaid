import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { PaymentValidationPipe } from '../common/pipes/payment-validation.pipe';
import { PositiveIntPipe } from '../common/pipes/positive-int.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('monthly')
  createMonthlyPayment(
    @Req() req: any,
    @Body(new PaymentValidationPipe()) createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentService.createMonthlyPayment(
      req.user.id,
      createPaymentDto,
    );
  }

  @Get()
  getAllPayments() {
    return this.paymentService.getAllPayments();
  }

  @Get(':id')
  getPaymentById(@Param('id', PositiveIntPipe) id: number) {
    return this.paymentService.getPaymentById(id);
  }

  @Patch(':id/status')
  updatePaymentStatus(
    @Param('id', PositiveIntPipe) id: number,
    @Body() updatePaymentStatusDto: UpdatePaymentStatusDto,
  ) {
    return this.paymentService.updatePaymentStatus(id, updatePaymentStatusDto);
  }

  @Delete(':id')
  deletePayment(@Param('id', PositiveIntPipe) id: number) {
    return this.paymentService.deletePayment(id);
  }
}