import { ReactNode } from "react";
import { Skeleton } from "../Skeleton/Skeleton";

const skeletonRowsFake = new Array(5).fill("");

export type TableColumn<T> = {
  title: string | ReactNode;
  property: keyof T;
  render?: (item: T) => ReactNode;
};

export type TableProps<T> = {
  columns: TableColumn<T>[];
  data: (T & { id: string })[];
  isLoading?: boolean;
};

export const Table = <T,>({ columns, data, isLoading }: TableProps<T>) => {
  return (
    <div
      className="flex flex-col justify-between overflow-auto w-full h-full border border-gray-800 shadow-md rounded"
      tabIndex={0}
    >
      <table>
        <thead>
          <tr>
            {columns.map((item) => (
              <th
                className="px-4 py-3 text-left whitespace-nowrap"
                key={`table-header-item-${String(item.property)}`}
              >
                {item.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <>
              {skeletonRowsFake.map((_, i) => (
                <tr
                  key={`fake-row-${i}`}
                  className="border-y last:border-none border-gray-800/25"
                >
                  {columns.map((col) => (
                    <td
                      key={`fake-cell-${i}-${String(col.property)}`}
                      className="text-left px-4 py-3 h-4"
                    >
                      <Skeleton />
                    </td>
                  ))}
                </tr>
              ))}
            </>
          )}
          {!isLoading && Boolean(data.length) && (
            <>
              {data.map((item) => (
                <tr
                  className="border-y last:border-none border-gray-800/25"
                  key={`table-body-item-row-${item.id}`}
                >
                  {columns.map((col) => (
                    <td
                      key={`table-body-item-cell-${String(col.property)}-${
                        item.id
                      }-`}
                      className="text-left px-4 py-3 whitespace-nowrap"
                    >
                      {col.render
                        ? col.render(item)
                        : (item[col.property] as any)}
                    </td>
                  ))}
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};
