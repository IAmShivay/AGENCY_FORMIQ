import CaseRoute, { caseMetadata, type CaseParams } from '@/components/portfolio/CaseRoute';

export const revalidate = 0;

export const generateMetadata = (props: CaseParams) => caseMetadata('design', props);

export default function Page(props: CaseParams) {
  return <CaseRoute section="design" {...props} />;
}
