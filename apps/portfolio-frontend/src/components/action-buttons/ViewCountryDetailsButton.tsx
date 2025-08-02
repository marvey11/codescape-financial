import { ActionButton } from "@codescape-financial/core-ui";
import { CountryResponseDTO } from "@codescape-financial/portfolio-data-models";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";

export const ViewCountryDetailsButton = ({
  country,
}: {
  country: CountryResponseDTO;
}) => {
  const navigate = useNavigate();
  return (
    <ActionButton
      aria-label={`Show details for ${country.name}`}
      onClick={() => {
        navigate(`/countries/${country.id}`);
      }}
    >
      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
    </ActionButton>
  );
};
