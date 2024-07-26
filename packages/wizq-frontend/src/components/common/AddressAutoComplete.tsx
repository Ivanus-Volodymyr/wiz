'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import PlacesAutocomplete, { Suggestion, geocodeByPlaceId } from 'react-places-autocomplete';
import Input from './Input';

interface AddressAutoCompleteProps extends React.SelectHTMLAttributes<HTMLInputElement> {
  error: string;
  isSubmitted?: boolean;
}

const AddressAutoComplete = React.forwardRef(({ error, isSubmitted, ...props }: AddressAutoCompleteProps, ref) => {
  const { setValue } = useFormContext();
  const [address, setAddress] = useState<string>('');
  const [components, setComponents] = useState<google.maps.GeocoderAddressComponent[]>([]);

  useEffect(() => {
    setAddress(props.value as string);
  }, [props.value as string]);

  useEffect(() => {
    components.forEach((component: google.maps.GeocoderAddressComponent) => {
      if (component.types[0] === 'route') {
        let address_line_1 = component.long_name;
        const hasStreetNumber = components[0]?.types[0] === 'street_number';

        if (hasStreetNumber) address_line_1 = `${components[0].long_name} ${address_line_1}`;

        setAddress(address_line_1);
        setValue('address', address_line_1, { shouldValidate: true });
      }
    });
  }, [components]);

  const handleChange = (addr: string) => {
    setAddress(addr);
    setValue('address', addr, { shouldValidate: true });
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={(_, pid: string) => {
        geocodeByPlaceId(pid).then((res: google.maps.GeocoderResult[]) => setComponents(res[0].address_components));
      }}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <>
          <Input
            {...getInputProps({ className: 'w-full' })}
            label="Street address"
            isSubmitted={isSubmitted}
            error={error}
          />
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}

            {suggestions.map((suggestion: Suggestion, key: number) => {
              const className = `p-2 mt-1 text-[#0D1835] ${suggestion.active ? 'bg-[#788398] text-white' : 'bg-white'}`;
              return (
                <div
                  key={key}
                  {...getSuggestionItemProps(suggestion, {
                    className,
                  })}
                >
                  <span className="font-karla">{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </PlacesAutocomplete>
  );
});

AddressAutoComplete.displayName = 'AddressAutoComplete';
export default AddressAutoComplete;
