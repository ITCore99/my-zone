(function() {

    //获取的年份
    let currentYear = new Date().getFullYear();
    //获取月份
    let currentMonth =new Date().getMonth();
    //获取当前月份天数
    let currentTotalDays = getMonthTotalDay(currentYear,currentMonth);
    //获取当前开始星期
    let currentStartWeek = getWeekMonthFirstDay(currentYear,currentMonth);
    //获取dom结构
    let displayYearMonth = document.querySelector("#yearMonth");
    let dateContainer = document.querySelector("#dateContainer");
    let prevBtn = document.querySelector("#prev");
    let nextBtn = document.querySelector("#next");
    //修改显示
    displayYearMonth.innerHTML = `${currentYear} - ${(currentMonth + 1) < 10 ? '0' + (currentMonth + 1) : (currentMonth + 1)}`;

    //获取月份的总天数
    function getMonthTotalDay(year,month) {
        return new Date(year,month + 1,0).getDate()
    }
    //获取月份第一天是星期几
    function getWeekMonthFirstDay(year,month) {
        return new Date(year,month,1).getDay();
    }

    //生成日历日期主体
    function createCalendarMain(startWeek,totalDays) {
        console.log(startWeek);
        let Fragment = document.createDocumentFragment();
        //逻辑判断只有周日是0 不符合空格的计算所以单独拿出来算
        let i = startWeek == 0 ?  -7 : -startWeek ;
        i = i + 2;
        for(;i <= totalDays; i++) { //重点
            let newDiv = document.createElement("div");
            newDiv.classList.add("date");
            if(i > 0) {
                newDiv.innerText = i;  
            }
            Fragment.appendChild(newDiv);
        }
        let children = document.querySelectorAll('.date');
        if(children.length > 0) {
            dateContainer.innerHTML = "";
        }
        dateContainer.appendChild(Fragment);
    }
    createCalendarMain(currentStartWeek,currentTotalDays);
    
    //上一个月
    function prevMonth() {
        currentYear = currentMonth - 1 < 0 ? currentYear - 1 : currentYear;
        currentMonth = currentMonth - 1 < 0 ? 11 : currentMonth - 1;
        displayYearMonth.innerHTML = `${currentYear} - ${(currentMonth + 1) < 10 ? '0' + (currentMonth + 1) : (currentMonth + 1)}`;
        let currentTotalDays = getMonthTotalDay(currentYear,currentMonth);
        let currentStartWeek = getWeekMonthFirstDay(currentYear,currentMonth);
        createCalendarMain(currentStartWeek,currentTotalDays);
    }
    //下一个月
    function nextMonth() {
        currentYear = currentMonth + 1 > 11 ? currentYear + 1 : currentYear;
        currentMonth = currentMonth + 1 > 11 ? (currentMonth + 1) % 12 : currentMonth + 1;
        displayYearMonth.innerHTML = `${currentYear} - ${(currentMonth + 1) < 10 ? '0' + (currentMonth + 1) : (currentMonth + 1)}`;
        let currentTotalDays = getMonthTotalDay(currentYear,currentMonth);
        let currentStartWeek = getWeekMonthFirstDay(currentYear,currentMonth);
        createCalendarMain(currentStartWeek,currentTotalDays);
    }
    prevBtn.addEventListener('click',prevMonth,false);
    nextBtn.addEventListener('click',nextMonth,false);
})();