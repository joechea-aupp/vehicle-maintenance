type Props = {
  search: any[];
};
export default function SearchItem({ search }: Props) {
  return (
    <body>
      {search.map((item: any) => {
        return (
          <tr key={item.id}>
            <td>
              {item.name} <br />
              <span className="text-sm">{item.description}</span>
            </td>
          </tr>
        );
      })}
    </body>
  );
}
