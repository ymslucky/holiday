'use client';

import Calendar from "@/component/Calendar";
import {useState} from "react";

export default function HolidayCalendar() {
    const calendar = useState({
        title: "三月",
        startDay: 6,
        days: 31
    })[0];

    return (
        <div className={"flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-purple-50"}>
            <Calendar calendar={calendar}/>
        </div>
    );
}