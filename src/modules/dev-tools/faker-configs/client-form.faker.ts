/**
 * Faker configuration for client form - DEV ONLY
 * This file is only loaded in development mode via import.meta.glob
 */
import { faker } from '@faker-js/faker';
import type { TFakerConfig } from '../utils/fake-data-generator';

export const fakerConfig: TFakerConfig = {
  npwp: () => faker.string.numeric(15),
  ktp: () => faker.string.numeric(16),
  ktp_file: 'image' as const,
  npwp_file: 'image' as const,
  client_type_id: 'skip' as const,
  name: () => faker.company.name(),
  pic_contacts: () => [faker.string.numeric(12), faker.string.numeric(12)],
  position_id: 'skip' as const,
  finance_contact_name: () => faker.person.fullName(),
  finance_contact_number: () => faker.string.numeric(12),
  coretax_username: () => faker.internet.username(),
  coretax_password: () => faker.internet.password(),
  coretax_pic_username: () => faker.internet.username(),
  coretax_pic_password: () => faker.internet.password(),
  djp_online_username: () => faker.internet.username(),
  djp_online_password: () => faker.internet.password(),
  email: () => faker.internet.email(),
  enofa_username: () => faker.internet.username(),
  passphrase: () => faker.internet.password({ length: 16 }),
  efin: () => faker.string.numeric(10),
  klu: () => faker.string.numeric(5),
  npwp_address: () => faker.location.streetAddress({ useFullAddress: true }),
  domicile_address: () =>
    faker.location.streetAddress({ useFullAddress: true }),
  client_status_code: 'skip' as const,
  join_date: () => faker.date.recent(),
  cut_date: 'skip' as const,
  cut_reason: 'skip' as const,
  pic_id: 'skip' as const,
  spv_id: 'skip' as const,
  is_active: () => true,
};
