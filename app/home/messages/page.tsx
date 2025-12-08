"use client"

import MainHeader from "@/components/MainHeader";
import Messages from "@/components/Messages";

export default function MessagesPage(){
    return(
        <div className="min-h-screen bg-gray-50">
        <MainHeader/>

        <section className="max-w-7xl mx-auto px-4 py-10">
          <Messages/>
        </section>
      </div>
    )
}