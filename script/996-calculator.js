
// Any Localization - © 2020-2021 George Huan. All rights reserved
// https://github.com/georgehuan1994/996-Salary-Calculator

let s_mon, s_tue, s_wed, s_thu, s_fri, s_sat, s_sun;
let d_mon, d_tue, d_wed, d_thu, d_fri, d_sat, d_sun;

let expected_year_salary = 300000;  // 期望年薪，按「955、12薪、满额公积金」的标准

let standard_monthly_rate = 1;      // 标准月薪，按 12 月计算
let standard_hourly_rate = 1;       // 标准时薪，按 965 计算

let computing_mode = 955;           // 预设：955, 965, 995, 995.5, 996, 0
let is_single_week = true;          // 是否为单周模式

let work_day_hours_normal = 0;      // 工作日正常工时
let work_day_hours_overtime = 0;    // 工作日加班工时
let week_day_hours = 0;             // 休息日工时

let deserved_year_salary = 0;       // 应得年薪
let deserved_month_salary = 0;      // 应得月薪

let how_many_month_get_paid = 12;   // 全年发放/月

let enterprise_provident_fund_deposit_ratio = 12;    // 公积金缴存比例 (公司)
let enterprise_provident_fund_deposit_base = 25000;  // 公积金缴存基数 (公司)

let corrected_month_salary = 0;     // 补正月薪


$(window).ready(function(){
    set_working_days(computing_mode);
});

$(document).scroll(function (){
    let docT = $(document).scrollTop();
    let docH = $(window).height();

    let resultbox = $('#result-pos').offset();
    let t = resultbox.top;
    let h = $('#result-pos').height();

    let isEntirelyVisible = ((t) < (docH + docT));

    if (isEntirelyVisible) {
        $('#result-box').removeClass('result-box-flex');
    }
    else {
        $('#result-box').addClass('result-box-flex');
    }
});

function set_working_days(mode) {
    computing_mode = mode;
    if (computing_mode === 955) {
        init_progress(8,8,8,8,8,0,0,8,8,8,8,8,0,0);
        show_double_week(false);
    }
    if (computing_mode === 965) {
        init_progress(9,9,9,9,9,0,0,9,9,9,9,9,0,0);
        show_double_week(false);
    }
    if (computing_mode === 995) {
        init_progress(12,12,12,12,12,0,0,12,12,12,12,12,0,0);
        show_double_week(false);
    }
    if (computing_mode === 995.5) {
        init_progress(12,12,12,12,12,12,0,12,12,12,12,12,0,0);
        show_double_week(true);
    }

    if (computing_mode === 996) {
        init_progress(12,12,12,12,12,12,0,12,12,12,12,12,12,0);
        show_double_week(false);
    }

    calc();
}

function calc() {
    // 获取排班
    s_mon = parseInt($('#s-mon').attr('aria-valuenow'));
    s_tue = parseInt($('#s-tue').attr('aria-valuenow'));
    s_wed = parseInt($('#s-wed').attr('aria-valuenow'));
    s_thu = parseInt($('#s-thu').attr('aria-valuenow'));
    s_fri = parseInt($('#s-fri').attr('aria-valuenow'));
    s_sat = parseInt($('#s-sat').attr('aria-valuenow'));
    s_sun = parseInt($('#s-sun').attr('aria-valuenow'));

    d_mon = parseInt($('#d-mon').attr('aria-valuenow'));
    d_tue = parseInt($('#d-tue').attr('aria-valuenow'));
    d_wed = parseInt($('#d-wed').attr('aria-valuenow'));
    d_thu = parseInt($('#d-thu').attr('aria-valuenow'));
    d_fri = parseInt($('#d-fri').attr('aria-valuenow'));
    d_sat = parseInt($('#d-sat').attr('aria-valuenow'));
    d_sun = parseInt($('#d-sun').attr('aria-valuenow'));

    // 计算全年（50周）正常工时、加班工时、休息日工时。
    // 工作日9小时内计为正常工时，1倍时薪；
    // 工作日超出9小时的部分计为加班工时，1.5倍时薪；
    // 休息日超出0小时的部分计为休息日工时，2倍时薪。
    if (is_single_week){
        let _WorkDayHourTotal = s_mon + s_tue + s_wed + s_thu + s_fri;
        work_day_hours_normal = (_WorkDayHourTotal <= 8 * 5 ? _WorkDayHourTotal : 8 * 5) * 50;
        work_day_hours_overtime = _WorkDayHourTotal * 50 - work_day_hours_normal;
        week_day_hours = (s_sat + s_sun) * 50;
        $('#workday-hours-normal').text(work_day_hours_normal);
        $('#workday-hours-overtime').text(work_day_hours_overtime);
        $('#weekday-hours').text(week_day_hours);
    }
    else {
        let _WorkDayHourTotal = s_mon + s_tue + s_wed + s_thu + s_fri + d_mon + d_tue + d_wed + d_thu + d_fri;
        work_day_hours_normal = (_WorkDayHourTotal <= 8 * 5 * 2 ? _WorkDayHourTotal : 8 * 5 * 2) * 50 / 2;
        work_day_hours_overtime = _WorkDayHourTotal * 50 / 2 - work_day_hours_normal;
        week_day_hours = (s_sat + s_sun + d_sat + d_sun) * 50 / 2;
        $('#workday-hours-normal').text(work_day_hours_normal);
        $('#workday-hours-overtime').text(work_day_hours_overtime);
        $('#weekday-hours').text(week_day_hours);
    }

    // 获取期望年薪
    if ($('#expected-year-salary').val() != '') {
        expected_year_salary = parseInt($('#expected-year-salary').val());
    }

    // 计算标准时薪、标准月薪
    standard_monthly_rate = expected_year_salary / 12;
    standard_hourly_rate = expected_year_salary / (8 * 5 * 50);
    $('#standard-hourly-rate').text(standard_hourly_rate.toLocaleString('zh', {style:'currency', currency: 'CNY', minimumFractionDigits: 2}));
    $('#standard-monthly-rate').text(standard_monthly_rate.toLocaleString('zh', {style:'currency', currency: 'CNY', minimumFractionDigits: 2}));

    // 计算应得年薪
    deserved_year_salary = standard_hourly_rate * (work_day_hours_normal + work_day_hours_overtime * 1.5 + week_day_hours * 2);
    $('#deserved-year-salary').text(deserved_year_salary.toLocaleString('zh', {style:'currency', currency: 'CNY', minimumFractionDigits: 2}));

    // 获取薪水发放月数。13薪、14薪、16薪...
    if ($('#how-many-month-paid').val() != '') {
        how_many_month_get_paid = Number($('#how-many-month-paid').val());
    }

    // 计算应得月薪
    deserved_month_salary = deserved_year_salary / how_many_month_get_paid;
    $('#deserved-month-salary').text(deserved_month_salary.toLocaleString('zh', {style:'currency', currency: 'CNY', minimumFractionDigits: 2}));

    // 获取公积金缴存比例（公司）
    // 下限：5%，上限：12%
    // 很多朋友对企业公积金的缴存比例有一个错误的认识，即：“我交多少，公司交多少。”
    // 但此数值与个人选取的比例无关，企业一般选取一个固定比例，并不会跟随个人缴存比例变化。
    if ($('#enterprise-provident-fund-deposit-ratio').val() != '') {
        enterprise_provident_fund_deposit_ratio = parseInt($('#enterprise-provident-fund-deposit-ratio').val());
    }

    // 获取公积金缴存基数（公司）
    // 下限：2100，上限：33786，不同地区有一些差别
    // 很多企业不仅缴存比例低，缴存基数也很低。
    // 重要提示：此数值通常与劳动合同中的“基本工资”一致，纠纷、裁员、竞业协议等补偿措施可能会被约束！
    if ($('#enterprise-provident-fund-deposit-base').val() != '') {
        enterprise_provident_fund_deposit_base = parseInt($('#enterprise-provident-fund-deposit-base').val());
    }

    // 根据公积金缴存比例和基数，补正应得月薪
    if ($('#is-same-fund-base').prop('checked')) {
        enterprise_provident_fund_deposit_base = corrected_month_salary = deserved_month_salary;
        if (enterprise_provident_fund_deposit_base < 2100) {
            enterprise_provident_fund_deposit_base = 2100;
        }
        if (enterprise_provident_fund_deposit_base > 33786) {
            enterprise_provident_fund_deposit_base = 33786;
        }
        corrected_month_salary = deserved_month_salary + enterprise_provident_fund_deposit_base * (12 - enterprise_provident_fund_deposit_ratio) / 100
        $('#enterprise-provident-fund-deposit-base').prop({'disabled':true,'placeholder':enterprise_provident_fund_deposit_base.toFixed(0),'value':enterprise_provident_fund_deposit_base});
    }
    else {
        corrected_month_salary = deserved_month_salary + enterprise_provident_fund_deposit_base * (12 - enterprise_provident_fund_deposit_ratio) / 100 + (deserved_month_salary - enterprise_provident_fund_deposit_base) * 0.12;
        $('#enterprise-provident-fund-deposit-base').prop({'disabled':false});
    }

    $('#corrected-month-salary').text(corrected_month_salary.toLocaleString('zh', {style:'currency', currency: 'CNY', minimumFractionDigits: 2}));
}

function check_expected_year_salary() {
    if (parseInt($('#expected-year-salary').val()) < 25200 ) {
        $('#expected-year-salary').val(25200);
        expected_year_salary = 25200;
    }
}

function set_expected_year_salary(value) {
    if ($('#expected-year-salary').val() == '') {
        expected_year_salary = parseInt($('#expected-year-salary').attr('placeholder'));
    }
    expected_year_salary += value;
    if (expected_year_salary < 25200 ) {
        expected_year_salary = 25200;
    }
    $('#expected-year-salary').val(expected_year_salary);
}

function check_how_many_month_get_paid() {
    if (parseInt($('#how-many-month-paid').val()) < 12 ) {
        $('#how-many-month-paid').val(12);
        how_many_month_get_paid = 12;
    }
}

function set_how_many_month_get_paid(value) {
    if ($('#how-many-month-paid').val() == '') {
        how_many_month_get_paid = parseInt($('#how-many-month-paid').attr('placeholder'));
    }
    how_many_month_get_paid += value;
    if (how_many_month_get_paid < 12) {
        how_many_month_get_paid = 12;
    }
    $('#how-many-month-paid').val(how_many_month_get_paid);
}

function check_fund_ratio() {
    if (parseInt($('#enterprise-provident-fund-deposit-ratio').val()) < 5 ) {
        $('#enterprise-provident-fund-deposit-ratio').val(5);
        enterprise_provident_fund_deposit_ratio = 5;
    }

    if (parseInt($('#enterprise-provident-fund-deposit-ratio').val()) > 12 ) {
        $('#enterprise-provident-fund-deposit-ratio').val(12);
        enterprise_provident_fund_deposit_ratio = 12;
    }
}

function set_fund_ratio(value) {
    if ($('#enterprise-provident-fund-deposit-ratio').val() == '') {
        enterprise_provident_fund_deposit_ratio = parseInt($('#enterprise-provident-fund-deposit-ratio').attr('placeholder'));
    }
    enterprise_provident_fund_deposit_ratio += value;
    if (enterprise_provident_fund_deposit_ratio < 5) {
        enterprise_provident_fund_deposit_ratio = 5;
    }
    if (enterprise_provident_fund_deposit_ratio > 12) {
        enterprise_provident_fund_deposit_ratio = 12;
    }
    $('#enterprise-provident-fund-deposit-ratio').val(enterprise_provident_fund_deposit_ratio);
}

function check_fund_base() {
    if (parseInt($('#enterprise-provident-fund-deposit-base').val()) < 2100) {
        $('#enterprise-provident-fund-deposit-base').val(2100);
        enterprise_provident_fund_deposit_base = 2100;
    }

    if (parseInt($('#enterprise-provident-fund-deposit-base').val()) > 33786) {
        $('#enterprise-provident-fund-deposit-base').val(33786);
        enterprise_provident_fund_deposit_base = 33786;
    }

    if (!$('#is-same-fund-base').prop('checked')) {
        $('#enterprise-provident-fund-deposit-base').data('lastValue', enterprise_provident_fund_deposit_base);
    }
}

function set_fund_base(value) {
    if ($('#enterprise-provident-fund-deposit-base').val() == '') {
        enterprise_provident_fund_deposit_base = parseInt($('#enterprise-provident-fund-deposit-base').attr('placeholder'));
    }
    enterprise_provident_fund_deposit_base += value;
    if (enterprise_provident_fund_deposit_base < 2100) {
        enterprise_provident_fund_deposit_base = 2100;
    }
    if (enterprise_provident_fund_deposit_base > 33786) {
        enterprise_provident_fund_deposit_base = 33786;
    }
    $('#enterprise-provident-fund-deposit-base').val(enterprise_provident_fund_deposit_base);

    if (!$('#is-same-fund-base').prop('checked')) {
        $('#enterprise-provident-fund-deposit-base').data('lastValue', enterprise_provident_fund_deposit_base);
    }
}

function is_same_fund_base_onchange() {
    if (!$('#is-same-fund-base').prop('checked')) {
        enterprise_provident_fund_deposit_base = $('#enterprise-provident-fund-deposit-base').data('lastValue');
        if (enterprise_provident_fund_deposit_base == undefined) {
            enterprise_provident_fund_deposit_base = 25000;
        }
        if (enterprise_provident_fund_deposit_base < 2100) {
            enterprise_provident_fund_deposit_base = 2100;
        }
        if (enterprise_provident_fund_deposit_base > 33786) {
            enterprise_provident_fund_deposit_base = 33786;
        }
        $('#enterprise-provident-fund-deposit-base').val(enterprise_provident_fund_deposit_base);
    }
}

function set_work_time(bar, value) {
    $('#custom').prop("checked",true);
    let _valuenow = parseInt(bar.attr('aria-valuenow'));
    _valuenow += value;
    if (_valuenow > 24) {
        _valuenow = 24;
    }
    if (_valuenow < 0) {
        _valuenow = 0;
    }
    bar.attr('aria-valuenow', _valuenow);
    bar.css('height',toPercent(_valuenow / 24));
    bar.children("p").text(_valuenow);
    set_progress_color(bar, _valuenow);
    calc();
}

function set_progress(id, value) {
    id.attr('aria-valuenow', value);
    id.css('height',toPercent(value / 24));
    id.children("p").text(value);
    set_progress_color(id,value);
}

function toPercent(point) {
    let str = Number(point * 100).toFixed(2);
    str += "%";
    return str;
}

function set_progress_color(id,value) {
    // text color
    if (value > 5) {
        id.children("p").css('color','#fff');
    }
    else {
        id.children("p").css('color','#24292f');
    }

    // progress color
    if (value >= 9) {
        id.css('background-color','#f0ad4e');
    }
    else if (value = 8) {
        id.css('background-color','#5bc0de');
    }
    else {
        id.css('background-color','#5cb85c');
    }

    $('#s-sat').css('background-color','#d9534f');
    $('#s-sun').css('background-color','#d9534f');
    $('#d-sat').css('background-color','#d9534f');
    $('#d-sun').css('background-color','#d9534f');
}

function show_double_week(b) {
    if (b) {
        is_single_week = false;
        $('#double-week').removeClass('hidden');
        $('#single-week-tab').removeClass('active');
        $('#double-week-tab').addClass('active');
    }
    else {
        is_single_week = true;
        $('#double-week').addClass('hidden');
        $('#single-week-tab').addClass('active');
        $('#double-week-tab').removeClass('active');
    }
}

function init_progress(s1,s2,s3,s4,s5,s6,s7,d1,d2,d3,d4,d5,d6,d7) {
    set_progress($('#s-mon'), s_mon = s1);
    set_progress($('#s-tue'), s_tue = s2);
    set_progress($('#s-wed'), s_wed = s3);
    set_progress($('#s-thu'), s_thu = s4);
    set_progress($('#s-fri'), s_fri = s5);
    set_progress($('#s-sat'), s_sat = s6);
    set_progress($('#s-sun'), s_sun = s7);

    set_progress($('#d-mon'), d_mon = d1);
    set_progress($('#d-tue'), d_tue = d2);
    set_progress($('#d-wed'), d_wed = d3);
    set_progress($('#d-thu'), d_thu = d4);
    set_progress($('#d-fri'), d_fri = d5);
    set_progress($('#d-sat'), d_sat = d6);
    set_progress($('#d-sun'), d_sun = d7);
}