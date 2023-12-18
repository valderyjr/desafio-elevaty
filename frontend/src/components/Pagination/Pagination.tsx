import {
  DYNAMIC_PAGES_LENGTH,
  DYNAMIC_PAGES_LENGTH_2,
  MIN_PAGE_TO_BREAKPOINT,
} from "../../utils/constants";
import { Button } from "../Button/Button";

function getPaginationCount({
  currentPage,
  totalResults,
  take,
}: {
  currentPage: number;
  totalResults: number;
  take: number;
}) {
  const multiplyResult = currentPage * take;

  const currentPageMaxResults =
    multiplyResult > totalResults ? totalResults : multiplyResult;

  const currentPageMinResults =
    totalResults === 0 ? 0 : multiplyResult - take + 1;

  return ` ${currentPageMinResults} - ${currentPageMaxResults} `;
}

export interface PaginationProps {
  currentPage: number;
  totalResults: number;
  totalPages: number;
  take: number;

  actions: {
    onClickPrevious: () => void;
    onClickNext: () => void;
    onClickPage: (page: number) => void;
  };
}

const getDynamicButtonsLength = ({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) => {
  return totalPages > MIN_PAGE_TO_BREAKPOINT
    ? currentPage < DYNAMIC_PAGES_LENGTH ||
      currentPage >= totalPages - DYNAMIC_PAGES_LENGTH
      ? DYNAMIC_PAGES_LENGTH_2
      : DYNAMIC_PAGES_LENGTH
    : totalPages;
};

const getButtonNumber = ({
  currentPage,
  totalPages,
  index,
}: {
  currentPage: number;
  totalPages: number;
  index: number;
}) => {
  const ifLeftSide =
    currentPage < DYNAMIC_PAGES_LENGTH || totalPages <= MIN_PAGE_TO_BREAKPOINT
      ? index + 1
      : currentPage + index;

  return currentPage >= totalPages - DYNAMIC_PAGES_LENGTH &&
    totalPages > MIN_PAGE_TO_BREAKPOINT
    ? totalPages - DYNAMIC_PAGES_LENGTH + index
    : ifLeftSide;
};

export const Pagination = ({
  currentPage,
  take,
  totalPages,
  totalResults,
  actions: { onClickNext, onClickPage, onClickPrevious },
}: PaginationProps) => {
  return (
    <div className={"flex justify-between items-center"}>
      <p className={"hidden lg:block"}>
        Exibindo
        <b>
          {getPaginationCount({
            currentPage: currentPage + 1,
            take,
            totalResults,
          })}
        </b>
        de <b>{totalResults}</b>{" "}
        {totalResults > 1 ? "resultados." : "resultado."}
      </p>

      <nav
        className={
          "flex gap-2 w-full justify-between lg:w-fit lg:justify-start"
        }
        aria-label="pagination"
      >
        <Button
          variant="outlined"
          disabled={currentPage === 0}
          onClick={onClickPrevious}
        >
          Anterior
        </Button>

        <div
          className={`${
            totalPages === 1 ? "hidden" : "hidden lg:flex lg:gap-2"
          } `}
        >
          {totalPages > MIN_PAGE_TO_BREAKPOINT &&
            currentPage >= DYNAMIC_PAGES_LENGTH && (
              <>
                <Button
                  onClick={() => {
                    onClickPage(1);
                  }}
                  variant={currentPage === 0 ? "primary" : "outlined"}
                >
                  {1}
                </Button>
                <div className={"flex items-end pointer-events-none"}>...</div>
              </>
            )}

          {new Array(
            getDynamicButtonsLength({
              currentPage,
              totalPages,
            })
          )
            .fill("")
            .map((_value, index) => {
              const buttonNumber = getButtonNumber({
                currentPage,
                totalPages,
                index,
              });

              return (
                <Button
                  key={index}
                  onClick={() => {
                    onClickPage(buttonNumber - 1);
                  }}
                  variant={
                    currentPage === buttonNumber - 1 ? "primary" : "outlined"
                  }
                >
                  {buttonNumber}
                </Button>
              );
            })}

          {totalPages > MIN_PAGE_TO_BREAKPOINT &&
            currentPage < totalPages - DYNAMIC_PAGES_LENGTH && (
              <>
                <div className={"flex items-end pointer-events-none"}>...</div>
                <Button
                  onClick={() => {
                    onClickPage(totalPages);
                  }}
                  variant={
                    currentPage === totalPages - 1 ? "primary" : "outlined"
                  }
                >
                  {totalPages}
                </Button>
              </>
            )}
        </div>

        <Button
          variant="outlined"
          disabled={currentPage === totalPages - 1 || totalPages === 0}
          onClick={onClickNext}
        >
          Próximo
        </Button>
      </nav>
    </div>
  );
};
