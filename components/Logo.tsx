export default function Logo({size = 100}:{size?:number}){
    return (
        <div className="flex gap-2 items-center ">
            <img src="/fulllogo.png" alt="" style={{maxHeight:size}}/>
            {/* <img src="/string-logo.png" alt="" className="h-10"/> */}
        </div>
    )
}