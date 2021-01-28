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

    return (
        <div className="row-buku-pinjam">
          <KembaliBukuModal
            // handleClickKembaliBuku={handleClickKembaliBuku}
            handleGetRefKembaliBuku={getRefFromChildKembaliBuku}
            book={props.bookData[0]}
            borrowed={props.b}
          />
          <PerpanjangPeminjamanModal
            handleGetRefPerpanjangPeminjaman={getRefFromChildPerpanjangPeminjaman}
            book={props.bookData[0]}
            borrowed={props.b}
          />
          <div>
            <li>{props.bookData[0].title}</li>
            <span>Kembali: {props.b.schedule.substring(0, 10)}</span>
          </div>
          <div>
            <button className="button kembali" onClick={handleClickKembaliBuku}>Kembali</button>
            <button className="button perpanjang" onClick={handleClickPerpanjangPeminjaman}>Perpanjang</button>
          </div>
        </div>
      )
}
