import {
  RPanelHeader,
  RStepper,
  type Step,
} from '@/modules/app/components/base/r-stepper';
import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { toast } from 'sonner';

const steps: Step[] = [
  { id: 'info', label: 'Setting Product' },
  { id: 'config', label: 'Adjust Price' },
];

const SampleStepper = () => {
  const [index, setIndex] = useState(0);

  const isLastStep = index === steps.length - 1;

  const handleNext = async () => {
    setIndex((i) => Math.min(steps.length - 1, i + 1));
  };

  const handlePrimary = async () => {
    if (isLastStep) {
      toast.success('Submit');
      return;
    }
    await handleNext();
  };

  return (
    <>
      <RPanelHeader
        title='Create New'
        onClose={() => toast.success('Close')}
        onCancel={() => setIndex((i) => Math.max(0, i - 1))}
        onOk={handlePrimary}
        showClose
        closeButton={{
          label: 'Back',
          icon: <ArrowLeft />,
        }}
        cancelButton={{
          label: 'Prev',
          disabled: index === 0,
          icon: <ChevronLeft className='size-4' />,
          variant: 'outline',
          iconPlacement: 'start',
        }}
        okButton={{
          label: isLastStep ? 'Submit' : 'Next',
          icon: isLastStep ? (
            <Save className='size-4' />
          ) : (
            <ChevronRight className='size-4' />
          ),
          variant: 'default',
          iconPlacement: 'end',
        }}
      />

      <RStepper
        className='mb-10'
        steps={steps}
        currentIndex={index}
        variant={'horizontal'}
      />
    </>
  );
};

export default SampleStepper;
