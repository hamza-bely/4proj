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
    public static final String DATE_TIME_LOCAL_PATTERN = "dd MMMM YYYY à HH:mm:ss ";
    public static final String DATE_LOCAL_PATTERN = "dd MMMM YYYY";

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern(DATE_PATTERN);
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern(DATE_TIME_PATTERN);
    private static final DateTimeFormatter DATE_TIME_FRENCH_FORMATTER = DateTimeFormatter.ofPattern(DATE_TIME_FRENCH_PATTERN);
    private static final DateTimeFormatter DATE_FRENCH_FORMATTER = DateTimeFormatter.ofPattern(DATE_FRENCH_PATTERN);
    private static final DateTimeFormatter DATE_LOCAL_FRENCH_FORMATTER = DateTimeFormatter.ofPattern(DATE_FRENCH_PATTERN);


    public static String NormalFormatWithLocalDate(LocalDate date) {
        if(date == null)
            return null;
        return DATE_FORMATTER.format(date);
    }
    public static String formatFrench(LocalDate date) {
        if(date == null)
            return null;
        return DATE_FRENCH_FORMATTER.format(date);
    }
    public static String LocalFrenchFormatWithLocalDate(LocalDate date) {
        if(date == null)
            return null;
        return DATE_LOCAL_FRENCH_FORMATTER.format(date);
    }
    public static String LocalFrenchFormatWithDate(Date date) {
        return DateFormatWithSpecificPattern(date, DATE_FRENCH_PATTERN);
    }
    public static String NormalFormatWithDate(Date date, String format) {
        return DateFormatWithSpecificPattern(date,DATE_PATTERN);
    }
    public static String DateFormatWithSpecificPattern(Date date,String format) {
        if(date == null)
            return null;
        SimpleDateFormat sdf = new SimpleDateFormat(format);

        return sdf.format(date);
    }
    public static String LocalDateFormatWithSpecificPattern(LocalDate date,String format) {
        if(date == null) return null;
        return date.format(DateTimeFormatter.ofPattern(format));
    }
    public static String now() {
        return LocalDateTime.now().format(DATE_TIME_FORMATTER);
    }
}
