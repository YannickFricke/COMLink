import React from 'react';
import { ErrorMessage } from 'formik';

interface FieldErrorProps {
    name: string;
}

export const FieldError: React.FC<FieldErrorProps> = ({ name }) => (
    <ErrorMessage name={name}>
        {errorMessage => <span className='text-red-500'>{errorMessage}</span>}
    </ErrorMessage>
);
