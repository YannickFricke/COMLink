import { ValidateStatus } from 'antd/lib/form/FormItem';

export interface FieldState {
    validateStatus: ValidateStatus;
    help?: string;
}
