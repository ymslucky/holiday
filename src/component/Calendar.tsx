import React from 'react';

export default function Calendar({calendar}: { calendar: { title: string, startDay: number, days: number } }) {
    const weekDays = ['一', '二', '三', '四', '五', '六', '日'];
    const {title, startDay, days} = calendar;
    const today = new Date().getDate();

    return (
        <div className="bg-white rounded-lg shadow-lg p-16 hover:transform-3d translate-x-5">
            <div className="text-2xl font-semibold text-center mb-6 text-gray-800">{title}</div>
            <div className="grid grid-cols-7 gap-2 md:gap-4 text-sm font-medium text-gray-500">
                {weekDays.map((day, index) => (
                    <div key={index} className={`text-center ${index === 5 || index === 6 ? 'text-red-500' : ''}`}>
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2 md:gap-4 mt-4">
                {Array.from({length: Math.max(0, startDay + days - 1)}, (_, index) => {
                    const dayNumber = index - startDay + 1; // 修改: index - startDay + 2 -> index - startDay + 1
                    if (dayNumber <= 0) return <div key={index}/>; // 添加: 确保不显示负数日期
                    return (
                        <div key={index}
                             className={`w-8 md:w-12 lg:w-16 h-8 md:h-12 lg:h-16 flex justify-center items-center rounded-lg shadow-lg hover:shadow-blue-300 ${dayNumber === today ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                            <div className="font-semibold">{dayNumber}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}