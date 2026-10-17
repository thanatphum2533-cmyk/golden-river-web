@echo off
chcp 65001 >nul
title อัพเดตขึ้น Vercel / GitHub
echo ===================================================
echo   Golden River Service - กำลังส่งข้อมูลขึ้น Vercel
echo ===================================================
echo.
git add .
git commit -m "Update site content from project"
git push origin main
echo.
echo ===================================================
echo [สำเร็จ] อัพเดตข้อมูลขึ้น GitHub เรียบร้อยแล้ว!
echo หน้าเว็บจริงบน Vercel จะอัพเดตอัตโนมัติภายใน 1-2 นาที
echo ===================================================
pause
