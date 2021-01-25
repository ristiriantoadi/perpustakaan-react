import { useEffect, useState } from 'react';
import { useStateGlobal } from '../../../utils/GlobalState';
import ReactApexChart from 'react-apexcharts';

import './Dashboard.css';

export default function Dashboard() {
  const [state] = useStateGlobal();
  const [borrower, setBorrower] = useState(0);
  const [dataChart, setDataChart] = useState([]);

  useEffect(() => {
    let dtchrt = [];
    document.title = 'Perpustakaan';
    if (state.member !== null) {
      const rs = state.member.filter((e) => {
        return e.borrowedBooks.books.length !== 0;
      });
      setBorrower(rs.length);
    }
    state.member &&
      state.member
        .filter((e) => {
          return e.borrowedBooks.books.length !== 0;
        })
        .map((e) => {
          return dtchrt.push({
            x: e.name,
            y: [
              new Date(e.borrowedBooks.borrowedDate).getTime(),
              new Date(e.borrowedBooks.schedule).getTime(),
            ],
          });
        });
    setDataChart(dtchrt);
  }, [state]);
  return (
    <section className='dashboard content'>
      <div>
        <div>
          <span>Total Buku</span>
          <span>{state.book !== null ? state.book.length : 0}</span>
        </div>
        <div>
          <span>Total Member</span>
          <span>{state.member !== null ? state.member.length : 0}</span>
        </div>
        <div>
          <span>Jumlah Peminjam</span>
          <span>{borrower}</span>
        </div>
      </div>
      <div>
        <span>Peminjam Buku</span>
        {dataChart.length !== 0 && (
          <ReactApexChart
            options={{
              chart: {
                height: 350,
                type: 'rangeBar',
              },
              plotOptions: {
                bar: {
                  horizontal: true,
                },
              },
              xaxis: {
                type: 'datetime',
              },
            }}
            series={[
              {
                data: dataChart,
              },
            ]}
            type='rangeBar'
            height={350}
          />
        )}
      </div>
    </section>
  );
}
