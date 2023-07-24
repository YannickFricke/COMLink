import React from 'react';

export interface IFormSubmitProps {
    isValid: boolean;
    isSubmitting: boolean;
    value: string;
}

export const FormSubmit: React.FC<IFormSubmitProps> = ({ isValid, isSubmitting, value }) => (
    <div className='mt-3'>
        <input type="submit"
               className={`w-full ${isValid && !isSubmitting ? 'bg-purple-900' : 'bg-purple-500'} text-white p-2 rounded cursor-pointer`}
               value={value}
               disabled={!isValid || isSubmitting}/>
    </div>
);
