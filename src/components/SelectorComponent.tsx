import { map } from "lodash";
import { useState } from "react";

export default function SelectorComponent({ options, onSelect, placeholder }) {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectChange = (event: Event) => {
    if (!event.target) return

    const value = event.target.value;
    setSelectedOption(value);

    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <>
      <div className="select is-rounded">
        <select value={selectedOption} onChange={handleSelectChange}>
          <option key="" value="" disabled>{placeholder}</option>
          {map(options, (option) => (
            <option key={option.key} value={option.key}>
              {option.key}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
