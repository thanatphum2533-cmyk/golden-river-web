@echo off
chcp 65001 >nul
title รัน Golden River Web (Localhost)
echo ===================================================
echo   Golden River Service - กำลังเริ่มระบบ...
echo ===================================================
echo ลิงก์หน้าเว็บหลัก:    http://localhost:3000
echo ลิงก์ระบบหลังบ้าน:  http://localhost:3000/admin (รหัสผ่าน: 8888)
echo ===================================================
echo (อย่าเพิ่งปิดหน้าต่างนี้ขณะใช้งานเว็บ)
echo.
call npm run dev
pause
