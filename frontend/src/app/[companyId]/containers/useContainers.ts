import { getContainers } from '@/api/containers';
import { ContainerDbParsedWithParcels } from '@/app/types';
import { useEffect, useState } from 'react';

export default function useContainers(companyId: string) {
  const [containers, setContainers] = useState<ContainerDbParsedWithParcels[]>([]);
  useEffect(() => {
    getContainers(companyId).then(result => setContainers(result));
  }, [companyId]);
  return { containers };
}
