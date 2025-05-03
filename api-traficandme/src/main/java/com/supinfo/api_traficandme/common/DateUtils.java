package com.supinfo.api_traficandme.common;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class DateUtils {
    public static final String DATE_PATTERN = "yyyy-MM-dd";
    public static final String DATE_TIME_PATTERN = "yyyy-MM-dd HH:mm:ss";
    public static final String DATE_TIME_FRENCH_PATTERN = "dd/MM/YYYY HH:mm";
    public static final String DATE_FRENCH_PATTERN = "dd/MM/YYYY";

    public static String DateFormatWithSpecificPattern(Date date,String format) {
        if(date == null)
            return null;
        SimpleDateFormat sdf = new SimpleDateFormat(format);

        return sdf.format(date);
    }

}
