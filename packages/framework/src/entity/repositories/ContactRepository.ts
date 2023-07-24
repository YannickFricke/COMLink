import { EntityRepository, Repository } from "typeorm";
import { Contact } from "../Contact";

@EntityRepository(Contact)
export class ContactRepository extends Repository<Contact> {
    async getContactsByUser(userId: number) {
        return await this.find({
            where: {
                owner: {
                    id: userId,
                },
            }
        });
    }
}
