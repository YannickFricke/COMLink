import React from 'react';
import { Form, Input } from 'antd';
import { ValidateStatus } from 'antd/lib/form/FormItem';

interface IFieldEntryProps {
    name: string;
    description: string;
    type: string;
    help?: string;
    validateStatus?: ValidateStatus;
    initialValue?: string;
}

export const FieldEntry: React.FC<IFieldEntryProps> = ({ name, description, type, validateStatus, help, initialValue }) => (
    <Form.Item label={description} name={name} validateStatus={validateStatus} help={help}
               initialValue={initialValue ?? ''}>
        <Input type={type} autoComplete={'off'}/>
    </Form.Item>
);
