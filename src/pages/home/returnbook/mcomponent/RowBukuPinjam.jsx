import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BooksIcon from '../../../../assets/icon/BooksIcon';
import IdCardIcon from '../../../../assets/icon/IdCardIcon';
import VeritifyUser from '../../../../assets/icon/VeritifyUser';
import { patchData, getData } from '../../../../library/AxiosLib';
import { useStateGlobal } from '../../../../utils/GlobalState';
import { ServerURL } from '../../../../config/default.json';
import { GET_DATA, UPDATE_MEMBER } from '../../../../utils/types';
import KembaliBukuModal from './KembaliBukuModal';
import PerpanjangPeminjamanModal from './PerpanjangPeminjamanModal';

export default function RowBukuPinjam(props) {
    const [state, dispatch] = useStateGlobal();
    const [refFromModlaPerpanjangPeminjaman, setRefFromModlaPerpanjangPeminjaman] = useState(null);
    const [refFromModlaKembaliBuku, setRefFromModlaKembaliBuku] = useState(null);

    // useEffect(() => {
    //   document.title = 'Perpustakaan - Member';
    //   console.log("row buku pinjam called")
    //   console.log(typeof props.b.schedule)
      
    // }, [state]);

    function getRefFromChildPerpanjangPeminjaman(e) {

        //this thing get called whenever the page load
        // console.log("get ref from child kembali buku called")
        
        //e.current is div.containerModalCreate.modal
        //this is the root div in the return function of CreateMemberModal
        // console.log(e)
        if (e.current) {
          setRefFromModlaPerpanjangPeminjaman(e);
        }
      }
    
      function getRefFromChildKembaliBuku(e) {
    
        //this thing get called whenever the page load
        // console.log("get ref from child kembali buku called")
        
        //e.current is div.containerModalCreate.modal
        //this is the root div in the return function of CreateMemberModal
        // console.log(e)
        if (e.current) {
          // e.book = {title:"Something",_id:1}
          // e.borrowed = {schedule:"something",book:1}
          // console.log("e: ")
          // console.log(e)
          setRefFromModlaKembaliBuku(e);
        }
      }
    
      function handleClickKembaliBuku() {
        // console.log("Borrow data: ")
        // console.log(borrowData)
        // console.log("book: ")
        // console.log(book)
        if (refFromModlaKembaliBuku.current) {
          // refFromModlaKembaliBuku.borrowed = borrowData;
          // refFromModlaKembaliBuku.book = book;
          refFromModlaKembaliBuku.current.style.visibility = 'visible';
        }
      }
    
      function handleClickPerpanjangPeminjaman() {
        if (refFromModlaPerpanjangPeminjaman.current) {
          refFromModlaPerpanjangPeminjaman.current.style.visibility = 'visible';
        }
      }

    // new Date("dateString") is browser-dependent and discouraged, so we'll write
    // a simple parse function for U.S. date format (which does no error checking)
    // function parseDate(str) {
    //     var mdy = str.split('-');
    //     return new Date(mdy[2], mdy[0]-1, mdy[1]);
    // }

    function datediff(first, second) {
        // Take the difference between the dates and divide by milliseconds per day.
        // Round to nearest whole number to deal with DST.
        return Math.round((second-first)/(1000*60*60*24));
    }

    function hitungDenda(){
        var currentDate = Date.now()
        var scheduleDate = Date.parse(props.b.schedule)
        var diff = Math.floor((currentDate-scheduleDate)/ 86400000); 
        if(diff>0)
            return 1000*diff
        return 0;
    }

    function convertScheduleToString(){
      // console.log("convert schedule to string called")
      // console.log(typeof props.b.schedule)
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
            // handleClickKembaliBuku={handleClickKembaliBuku}
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
            {/* {console.log("props b schedule: ")} */}
            {/* {console.log(typeof props.b.schedule)} */}
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
