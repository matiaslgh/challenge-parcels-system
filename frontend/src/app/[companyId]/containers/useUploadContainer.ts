import { upsertContainer } from '@/api/containers';
import { ContainerInput } from '@/app/types';
import { ChangeEventHandler } from 'react';
import xml2js from 'xml2js';

function xmlToContainerInput(
  text: string | ArrayBuffer,
  callback: (error: Error | null, result?: ContainerInput) => void,
) {
  // TODO: Validate file
  xml2js.parseString(text, (error, result) => {
    if (error) {
      return callback(error);
    }

    // Process XML to match ContainerInput structure
    // TODO: Type properly
    const jsonResult = result.Container;
    const containerInput = {
      id: jsonResult.Id[0],
      shippingDate: jsonResult.ShippingDate[0],
      parcels: jsonResult.parcels[0].Parcel.map((parcel: any) => ({
        recipient: {
          name: parcel.Recipient[0].Name[0],
          address: {
            street: parcel.Recipient[0].Address[0].Street[0],
            houseNumber: parcel.Recipient[0].Address[0].HouseNumber[0],
            postalCode: parcel.Recipient[0].Address[0].PostalCode[0],
            city: parcel.Recipient[0].Address[0].City[0],
          },
        },
        weight: parseFloat(parcel.Weight[0]),
        value: parseFloat(parcel.Value[0]),
      })),
    };

    return callback(null, containerInput);
  });
}

export default function useUploadContainer(companyId: string) {
  const onFileChange: ChangeEventHandler<HTMLInputElement> = event => {
    event.preventDefault();

    if (event.target.files === null) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async function () {
      if (reader.result === null) {
        return;
      }

      xmlToContainerInput(reader.result, (error, containerInput) => {
        if (error || containerInput === undefined) {
          console.log(error);
          return;
        }

        // TODO: Handle result and error properly
        upsertContainer(companyId, containerInput);
      });
    };

    reader.readAsText(event.target.files[0]);
  };

  return { onFileChange };
}
