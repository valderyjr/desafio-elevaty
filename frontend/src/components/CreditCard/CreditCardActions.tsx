import {
  DocumentArrowDownIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../Button/Button";

type CreditCardActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
  onGetInvoice: () => void;
  loading: boolean;
};

export const CreditCardActions = ({
  onDelete,
  onEdit,
  onGetInvoice,
  loading,
}: CreditCardActionsProps) => {
  return (
    <div className="w-full flex gap-2 [&>button]:w-full">
      <Button
        size="sm"
        variant="outlined"
        title="Editar cartão"
        onClick={onEdit}
        loading={loading}
      >
        <PencilIcon className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="outlined"
        title="Excluir cartão"
        onClick={onDelete}
        loading={loading}
      >
        <TrashIcon className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="outlined"
        title="Emitir fatura do cartão"
        onClick={onGetInvoice}
        loading={loading}
      >
        <DocumentArrowDownIcon className="w-4 h-4" />
      </Button>
    </div>
  );
};
