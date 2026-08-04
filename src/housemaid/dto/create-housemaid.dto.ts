export class CreateHousemaidDto {
  fullName!: string;
  email!: string;
  password!: string;
  nidNumber!: string;
  phone!: string;
  experience!: number;
  expectedSalary!: number;
  availability!: string;
  location!: string;
  skills?: string[];
}