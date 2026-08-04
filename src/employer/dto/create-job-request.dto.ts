export class CreateJobRequestDto {
  workType!: string;
  description!: string;
  location!: string;
  workDate!: string;
  startTime!: string;
  endTime!: string;
  budget!: number;
}