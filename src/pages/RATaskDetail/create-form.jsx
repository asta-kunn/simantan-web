import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ChevronLeftIcon, CubeIcon } from '@heroicons/react/24/outline';
import { SelectInput } from '@/components/form/SelectInput';
import ProductInformationForm from './product-information-form';

const RegistrationSchema = Yup.object().shape({
  dosageForm: Yup.string().required('Dosage Form harus diisi'),
  unitOfMeassure: Yup.string().required('Unit of Meassure harus diisi'),
  strength: Yup.string().required('Strength harus diisi'),
});

const CreateFormRA = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { id: 1, name: 'Product Information', active: activeStep === 1 },
    { id: 2, name: 'Detail MFG Information', active: activeStep === 2 },
    { id: 3, name: 'Approval Information', active: activeStep === 3 },
  ];

  const handleContinue = (e) => {
    alert("OK")
    setActiveStep(prevStep => Math.min(prevStep + 1, 3));
  };

  const handleSaveAsDraft = () => {
    console.log('Saved as draft');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-4 md:p-6">
        <div className="flex items-center mb-2">
          <button className="text-blue-600 mr-2">
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">New Registration</h1>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span>Form New Product (Initial) AL</span>
        </div>

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mt-4 text-right">
          <span>Home / PLM NIE / New Registration</span>
        </div>
      </div>

      {/* Steps */}
      <div className="px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.active ? 'bg-transparent text-stone-600 border border-orange-500 text-sm' :
                  step.id < activeStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500 text-sm'
                  }`}>
                  {step.id}
                </div>
                <div className="text-center mt-2">
                  <p className="text-sm font-medium">{step.name}</p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className={`h-0.5 ${index < activeStep - 1 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-6 py-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-6">
            <CubeIcon className="h-6 w-6 text-gray-700 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Product Information</h2>
          </div>

          {/* Product Info Card */}
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Registration Type</p>
                <p className="text-sm font-medium">Local Initial - Approvable Letter</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Reference Item FG</p>
                <p className="text-sm font-medium">A-18270-00 Paracetamol Blister 100 MG</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">NIE No.</p>
                <p className="text-sm font-medium">DKL382918918</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Item FG</p>
                <p className="text-sm font-medium">A-18270-00 Paracetamol Strip 100 MG</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Reg. Holder</p>
                <p className="text-sm font-medium">PT DEXA MEDICA</p>
              </div>
            </div>
          </div>

          <Formik
            initialValues={{
              dosageForm: '',
              unitOfMeassure: '',
              strength: '',
            }}
            validationSchema={RegistrationSchema}
            onSubmit={(values) => {
              console.log(values);
              handleContinue();
            }}
          >
            {({ errors, touched, isValid }) => (
              <Form>
                {activeStep == 1 && <ProductInformationForm saveAsDraft={handleSaveAsDraft} />}
                {activeStep == 2 && <ProductInformationForm saveAsDraft={handleSaveAsDraft} />}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CreateFormRA;