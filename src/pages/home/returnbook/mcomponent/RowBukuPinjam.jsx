import { useState } from 'react';
import KembaliBukuModal from './KembaliBukuModal';
import PerpanjangPeminjamanModal from './PerpanjangPeminjamanModal';

export default function RowBukuPinjam(props) {
    const [refFromModlaPerpanjangPeminjaman, setRefFromModlaPerpanjangPeminjaman] = useState(null);
    const [refFromModlaKembaliBuku, setRefFromModlaKembaliBuku] = useState(null);

    function getRefFromChildPerpanjangPeminjaman(e) {
      if (e.current) {
        setRefFromModlaPerpanjangPeminjaman(e);
      }
    }
    
    function getRefFromChildKembaliBuku(e) {
      if (e.current) {
        setRefFromModlaKembaliBuku(e);
      }
    }
    
    //open modal kembali buku
    function handleClickKembaliBuku() {
      if (refFromModlaKembaliBuku.current) {
         refFromModlaKembaliBuku.current.style.visibility = 'visible';
      }
    }
    
    //ope modal perpanjang peminjaman
    function handleClickPerpanjangPeminjaman() {
      if (refFromModlaPerpanjangPeminjaman.current) {
        refFromModlaPerpanjangPeminjaman.current.style.visibility = 'visible';
      }
    }

    function hitungDenda(){
      var currentDate = Date.now()
      var scheduleDate = Date.parse(props.b.schedule)
        var diffInDays = Math.floor((currentDate-scheduleDate)/ 86400000); 
        if(diffInDays>0)
            return 1000*diffInDays
        return 0;
    }

    //Convert Date Object menjadi string
    function convertScheduleToString(){
      if(typeof props.b.schedule == "object" && props.b.schedule !== null){
        var getYear = props.b.schedule.getFullYear();
        var getMonth = props.b.schedule.getMonth()+1;
        if(getMonth<10){
          getMonth=`0${getMonth}`
        }
        var getDate = props.b.schedule.getDate();
        if(getDate<10){
          getDate=`0${getDate}`
        }
        props.b.schedule = `${getYear}-${getMonth}-${getDate}`
      }
    }

    return (
        <div className="row-buku-pinjam">
          <KembaliBukuModal
            handleGetRefKembaliBuku={getRefFromChildKembaliBuku}
            book={props.bookData[0]}
            borrowed={props.b}
            borrowedBooks={props.borrowedBooks}
            denda={hitungDenda()}
            member_id={props.member_id}
          />
          <PerpanjangPeminjamanModal
            handleGetRefPerpanjangPeminjaman={getRefFromChildPerpanjangPeminjaman}
            book={props.bookData[0]}
            borrowed={props.b}
            borrowedBooks={props.borrowedBooks}
            denda={hitungDenda()}
            member_id={props.member_id}
          />
          <div>
            <li>{props.bookData[0].title}</li>
            {convertScheduleToString()}
            <span>Kembali: {props.b.schedule.substring(0, 10)}</span>
          </div>
          <div>
            <button className="button kembali" onClick={handleClickKembaliBuku}>Kembali</button>
            <button className="button perpanjang" onClick={handleClickPerpanjangPeminjaman}>Perpanjang</button>
          </div>
        </div>
      )
}
