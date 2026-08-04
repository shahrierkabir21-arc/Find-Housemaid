import { PaymentStatus } from '../../common/enums';

export class UpdatePaymentStatusDto {
  status!: PaymentStatus;
}