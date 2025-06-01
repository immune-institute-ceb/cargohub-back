// Purpose: Interface to extend User entity with optional relations to Client and Carrier entities.

//* Entities
import { User } from '../entities/user.entity';
import { Client } from '@modules/clients/entities/client.entity';
import { Carrier } from '@modules/carriers/entities/carrier.entity';

export interface UserWithRelations extends User {
  client?: Client | null;
  carrier?: Carrier | null;
}
