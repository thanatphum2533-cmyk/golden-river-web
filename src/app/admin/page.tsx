'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Inbox, Briefcase, Building, Settings, Heart, BookOpen,
  Sparkles, MoveHorizontal, Award, ArrowLeft, CheckCircle2, Plus, Trash2,
  Save, Lock, ExternalLink, Upload, Image as ImageIcon, Loader2, Users,
  Calendar, Building2, Phone, Mail, MapPin, Clock, FileText, CheckSquare,
  X, Star, Eye, Menu, ChevronRight, RotateCcw, ChevronUp, ChevronDown,
  Bell, Send, AlertCircle, EyeOff, Check, Copy, MessageSquare
} from 'lucide-react';
import initialData from '@/data/siteData.json';

type TabType =
  | 'inquiries'
  | 'notifications'
  | 'hero'
  | 'services'
  | 'beforeAfter'
  | 'projects'
  | 'guarantees'
  | 'clients'
  | 'csr'
  | 'articles'
  | 'company'
  | 'background';

export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('inquiries');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState<any>(initialData);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Upload States
  const [uploading, setUploading] = useState(false);
  const [viewingInquiryPhotos, setViewingInquiryPhotos] = useState<string[] | null>(null);

  // New Hero Banner Slide Form
  const [newHeroSlide, setNewHeroSlide] = useState({
    title: '',
    subtitle: '',
    tag: '',
    badge: '',
    image: ''
  });
  const heroSlideFileInputRef = useRef<HTMLInputElement>(null);

  // Email & LINE Notification States
  const [testEmailRecipient, setTestEmailRecipient] = useState('');
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const lineQrFileInputRef = useRef<HTMLInputElement>(null);

  // New Project Form with 10 Photos Support
  const [newProject, setNewProject] = useState<{
    title: string;
    category: string;
    location: string;
    highlight: string;
    image: string;
    images: string[];
    services: string;
  }>({
    title: '',
    category: 'condo',
    location: '',
    highlight: '',
    image: '/images/garden.jpg',
    images: ['/images/garden.jpg'],
    services: 'ดูแลสวนประจำโครงการ, ดูแลสระว่ายน้ำ'
  });
  const projectFileInputRef = useRef<HTMLInputElement>(null);

  // New CSR Form with 10 Photos Support
  const [newCsr, setNewCsr] = useState<{
    title: string;
    date: string;
    location: string;
    category: string;
    desc: string;
    image: string;
    images: string[];
  }>({
    title: '',
    date: '',
    location: '',
    category: 'ช่วยเหลือสังคม',
    desc: '',
    image: '/images/csr-donation-nokkhamin.jpg',
    images: ['/images/csr-donation-nokkhamin.jpg']
  });
  const csrFileInputRef = useRef<HTMLInputElement>(null);

  // New Article Form with 10 Photos Support
  const [newArticle, setNewArticle] = useState<{
    title: string;
    date: string;
    author: string;
    readTime: string;
    summary: string;
    content: string;
    image: string;
    images: string[];
    tags: string;
  }>({
    title: '',
    date: '',
    author: 'ทีมผู้เชี่ยวชาญ GR Group',
    readTime: '4 นาที',
    summary: '',
    content: '',
    image: '/images/garden.jpg',
    images: ['/images/garden.jpg'],
    tags: 'ดูแลสวน, สาระน่ารู้'
  });
  const articleFileInputRef = useRef<HTMLInputElement>(null);

  // New Client Form
  const [newClient, setNewClient] = useState({ name: '', role: '', image: '/images/garden.jpg' });
  const clientFileInputRef = useRef<HTMLInputElement>(null);

  // Refs for Before/After Upload
  const beforeImgInputRef = useRef<HTMLInputElement>(null);
  const afterImgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem('gr_admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch('/api/data?t=' + Date.now(), { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
      const inqRes = await fetch('/api/inquiries?t=' + Date.now(), { cache: 'no-store' });
      if (inqRes.ok) setInquiries(await inqRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '8888' || pin === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('gr_admin_auth', 'true');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Generic File Upload Helper (Single File)
  const uploadFile = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (res.ok && json.url) return json.url;
      alert(json.error || 'อัปโหลดไม่สำเร็จ');
      return null;
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการอัปโหลด');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Multiple File Upload Helper (Up to maxCount files)
  const uploadMultipleFiles = async (files: FileList | File[], maxCount = 10): Promise<string[]> => {
    setUploading(true);
    try {
      const formData = new FormData();
      const filesArr = Array.from(files).slice(0, maxCount);
      filesArr.forEach(f => formData.append('files', f));
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (res.ok && Array.isArray(json.urls)) return json.urls;
      if (res.ok && json.url) return [json.url];
      alert(json.error || 'อัปโหลดไม่สำเร็จ');
      return [];
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการอัปโหลด');
      return [];
    } finally {
      setUploading(false);
    }
  };

  // Save all changes to server
  const handleSaveData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (e) {
      alert('บันทึกไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    await fetch('/api/inquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  // Handlers for Projects with 10 Photos Support
  const handleNewProjectUpload = async (files: FileList) => {
    const remaining = 10 - newProject.images.length;
    if (remaining <= 0) {
      alert('สามารถใส่รูปภาพโครงการได้สูงสุด 10 รูปครับ');
      return;
    }
    const uploaded = await uploadMultipleFiles(files, remaining);
    if (uploaded.length > 0) {
      setNewProject(prev => {
        const nextImgs = [...prev.images, ...uploaded].slice(0, 10);
        return { ...prev, images: nextImgs, image: nextImgs[0] };
      });
    }
  };

  const handleRemoveNewProjectImage = (index: number) => {
    setNewProject(prev => {
      const filtered = prev.images.filter((_, i) => i !== index);
      const safe = filtered.length > 0 ? filtered : ['/images/garden.jpg'];
      return { ...prev, images: safe, image: safe[0] };
    });
  };

  const handleSetNewProjectCover = (index: number) => {
    setNewProject(prev => {
      const target = prev.images[index];
      const others = prev.images.filter((_, i) => i !== index);
      const reordered = [target, ...others];
      return { ...prev, images: reordered, image: target };
    });
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;
    const catName =
      newProject.category === 'condo' ? 'คอนโดมิเนียม' :
      newProject.category === 'luxury' ? 'ลักชัวรี' :
      newProject.category === 'housing' ? 'หมู่บ้านจัดสรร' : 'พาณิชย์/โรงแรม';

    const gallery = newProject.images.length > 0 ? newProject.images.slice(0, 10) : [newProject.image];
    const cover = gallery[0] || newProject.image;

    const item = {
      id: 'proj-' + Date.now(),
      title: newProject.title,
      category: newProject.category,
      categoryName: catName,
      location: newProject.location || 'กรุงเทพมหานคร',
      highlight: newProject.highlight || 'โครงการคุณภาพมาตรฐาน GR Group',
      image: cover,
      gallery: gallery,
      services: newProject.services.split(',').map(s => s.trim())
    };
    setData({ ...data, projects: [item, ...(data.projects || [])] });
    setNewProject({
      title: '', category: 'condo', location: '', highlight: '',
      image: '/images/garden.jpg', images: ['/images/garden.jpg'],
      services: 'ดูแลสวนประจำโครงการ'
    });
    alert('เพิ่มโครงการพร้อมแกลเลอรีรูปภาพสำเร็จ! อย่าลืมกด "บันทึกการเปลี่ยนแปลงทั้งหมด"');
  };

  const handleAddPhotosToExistingProject = async (projId: string, files: FileList) => {
    const target = data.projects.find((p: any) => p.id === projId);
    if (!target) return;
    const currentGal: string[] = (target.gallery && target.gallery.length > 0) ? target.gallery : [target.image];
    const remaining = 10 - currentGal.length;
    if (remaining <= 0) {
      alert('โครงการนี้ใส่รูปภาพครบ 10 รูปแล้วครับ');
      return;
    }
    const uploaded = await uploadMultipleFiles(files, remaining);
    if (uploaded.length > 0) {
      setData((prev: any) => ({
        ...prev,
        projects: prev.projects.map((p: any) => {
          if (p.id !== projId) return p;
          const nextGal = [...currentGal, ...uploaded].slice(0, 10);
          return { ...p, gallery: nextGal, image: nextGal[0] };
        })
      }));
    }
  };

  const handleRemoveExistingProjectPhoto = (projId: string, photoIdx: number) => {
    setData((prev: any) => ({
      ...prev,
      projects: prev.projects.map((p: any) => {
        if (p.id !== projId) return p;
        const currentGal: string[] = (p.gallery && p.gallery.length > 0) ? p.gallery : [p.image];
        if (currentGal.length <= 1) {
          alert('โครงการต้องมีรูปภาพอย่างน้อย 1 รูปครับ');
          return p;
        }
        const nextGal = currentGal.filter((_, i) => i !== photoIdx);
        return { ...p, gallery: nextGal, image: nextGal[0] };
      })
    }));
  };

  const handleSetExistingProjectCover = (projId: string, photoIdx: number) => {
    setData((prev: any) => ({
      ...prev,
      projects: prev.projects.map((p: any) => {
        if (p.id !== projId) return p;
        const currentGal: string[] = (p.gallery && p.gallery.length > 0) ? p.gallery : [p.image];
        const chosen = currentGal[photoIdx];
        const others = currentGal.filter((_, i) => i !== photoIdx);
        const nextGal = [chosen, ...others];
        return { ...p, gallery: nextGal, image: chosen };
      })
    }));
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('ยืนยันการลบโครงการนี้?')) {
      setData({ ...data, projects: data.projects.filter((p: any) => p.id !== id) });
    }
  };

  // Handlers for CSR with 10 Photos Support
  const handleNewCsrUpload = async (files: FileList) => {
    const remaining = 10 - newCsr.images.length;
    if (remaining <= 0) {
      alert('สามารถใส่รูปภาพกิจกรรม CSR ได้สูงสุด 10 รูปครับ');
      return;
    }
    const uploaded = await uploadMultipleFiles(files, remaining);
    if (uploaded.length > 0) {
      setNewCsr(prev => {
        const nextImgs = [...prev.images, ...uploaded].slice(0, 10);
        return { ...prev, images: nextImgs, image: nextImgs[0] };
      });
    }
  };

  const handleAddPhotosToExistingCsr = async (csrId: string, files: FileList) => {
    const target = data.csr.find((c: any) => c.id === csrId);
    if (!target) return;
    const currentGal: string[] = (target.gallery && target.gallery.length > 0) ? target.gallery : (target.images && target.images.length > 0 ? target.images : [target.image]);
    const remaining = 10 - currentGal.length;
    if (remaining <= 0) {
      alert('กิจกรรมนี้มีรูปภาพครบ 10 รูปแล้วครับ');
      return;
    }
    const uploaded = await uploadMultipleFiles(files, remaining);
    if (uploaded.length > 0) {
      setData((prev: any) => ({
        ...prev,
        csr: prev.csr.map((c: any) => {
          if (c.id !== csrId) return c;
          const nextGal = [...currentGal, ...uploaded].slice(0, 10);
          return { ...c, gallery: nextGal, images: nextGal, image: nextGal[0] };
        })
      }));
    }
  };

  const handleRemoveExistingCsrPhoto = (csrId: string, photoIdx: number) => {
    setData((prev: any) => ({
      ...prev,
      csr: prev.csr.map((c: any) => {
        if (c.id !== csrId) return c;
        const currentGal: string[] = (c.gallery && c.gallery.length > 0) ? c.gallery : (c.images && c.images.length > 0 ? c.images : [c.image]);
        if (currentGal.length <= 1) {
          alert('กิจกรรมต้องมีรูปภาพอย่างน้อย 1 รูปครับ');
          return c;
        }
        const nextGal = currentGal.filter((_, i) => i !== photoIdx);
        return { ...c, gallery: nextGal, images: nextGal, image: nextGal[0] };
      })
    }));
  };

  const handleAddCsr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCsr.title) return;
    const gallery = newCsr.images.length > 0 ? newCsr.images.slice(0, 10) : [newCsr.image];
    const item = {
      id: 'csr-' + Date.now(),
      title: newCsr.title,
      date: newCsr.date || 'ปี 2568',
      location: newCsr.location || 'กรุงเทพมหานคร',
      category: newCsr.category,
      desc: newCsr.desc || 'กิจกรรมส่งมอบสิ่งดีคืนสู่สังคมไทย โดย GR Group',
      image: gallery[0] || newCsr.image,
      images: gallery,
      gallery: gallery
    };
    setData({ ...data, csr: [item, ...(data.csr || [])] });
    setNewCsr({
      title: '', date: '', location: '', category: 'ช่วยเหลือสังคม',
      desc: '', image: '/images/csr-donation-nokkhamin.jpg',
      images: ['/images/csr-donation-nokkhamin.jpg']
    });
    alert('เพิ่มกิจกรรม CSR เรียบร้อย! อย่าลืมกด "บันทึกการเปลี่ยนแปลงทั้งหมด"');
  };

  const handleDeleteCsr = (id: string) => {
    if (confirm('ยืนยันการลบกิจกรรม CSR นี้?')) {
      setData({ ...data, csr: data.csr.filter((c: any) => c.id !== id) });
    }
  };

  // Handlers for Articles with Multi-Photo Support (Up to 10 Photos)
  const handleNewArticleUpload = async (files: FileList) => {
    const remaining = 10 - newArticle.images.length;
    if (remaining <= 0) {
      alert('สามารถใส่รูปภาพบทความได้สูงสุด 10 รูปครับ');
      return;
    }
    const uploaded = await uploadMultipleFiles(files, remaining);
    if (uploaded.length > 0) {
      setNewArticle(prev => {
        const nextImgs = [...prev.images, ...uploaded].slice(0, 10);
        return { ...prev, images: nextImgs, image: nextImgs[0] };
      });
    }
  };

  const handleRemoveNewArticleImage = (index: number) => {
    setNewArticle(prev => {
      const filtered = prev.images.filter((_, i) => i !== index);
      const safe = filtered.length > 0 ? filtered : ['/images/garden.jpg'];
      return { ...prev, images: safe, image: safe[0] };
    });
  };

  const handleSetNewArticleCover = (index: number) => {
    setNewArticle(prev => {
      const target = prev.images[index];
      const others = prev.images.filter((_, i) => i !== index);
      const reordered = [target, ...others];
      return { ...prev, images: reordered, image: target };
    });
  };

  const handleAddPhotosToExistingArticle = async (articleId: string, files: FileList) => {
    const target = data.articles.find((a: any) => a.id === articleId);
    if (!target) return;
    const currentGal: string[] = (target.images && target.images.length > 0)
      ? target.images
      : (target.gallery && target.gallery.length > 0 ? target.gallery : [target.image]);
    const remaining = 10 - currentGal.length;
    if (remaining <= 0) {
      alert('บทความนี้มีรูปภาพครบ 10 รูปแล้วครับ');
      return;
    }
    const uploaded = await uploadMultipleFiles(files, remaining);
    if (uploaded.length > 0) {
      setData((prev: any) => ({
        ...prev,
        articles: prev.articles.map((a: any) => {
          if (a.id !== articleId) return a;
          const nextGal = [...currentGal, ...uploaded].slice(0, 10);
          return { ...a, images: nextGal, gallery: nextGal, image: nextGal[0] };
        })
      }));
    }
  };

  const handleRemoveExistingArticlePhoto = (articleId: string, photoIdx: number) => {
    setData((prev: any) => ({
      ...prev,
      articles: prev.articles.map((a: any) => {
        if (a.id !== articleId) return a;
        const currentGal: string[] = (a.images && a.images.length > 0)
          ? a.images
          : (a.gallery && a.gallery.length > 0 ? a.gallery : [a.image]);
        if (currentGal.length <= 1) {
          alert('บทความต้องมีรูปภาพอย่างน้อย 1 รูปครับ');
          return a;
        }
        const nextGal = currentGal.filter((_, i) => i !== photoIdx);
        return { ...a, images: nextGal, gallery: nextGal, image: nextGal[0] };
      })
    }));
  };

  const handleSetExistingArticleCover = (articleId: string, photoIdx: number) => {
    setData((prev: any) => ({
      ...prev,
      articles: prev.articles.map((a: any) => {
        if (a.id !== articleId) return a;
        const currentGal: string[] = (a.images && a.images.length > 0)
          ? a.images
          : (a.gallery && a.gallery.length > 0 ? a.gallery : [a.image]);
        const chosen = currentGal[photoIdx];
        const others = currentGal.filter((_, i) => i !== photoIdx);
        const nextGal = [chosen, ...others];
        return { ...a, images: nextGal, gallery: nextGal, image: chosen };
      })
    }));
  };

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title) return;
    const gallery = newArticle.images.length > 0 ? newArticle.images.slice(0, 10) : [newArticle.image];
    const cover = gallery[0] || newArticle.image;

    const item = {
      id: 'art-' + Date.now(),
      slug: 'article-' + Date.now(),
      title: newArticle.title,
      date: newArticle.date || 'กันยายน 2568',
      author: newArticle.author || 'ทีมผู้เชี่ยวชาญ GR Group',
      readTime: newArticle.readTime || '4 นาที',
      summary: newArticle.summary,
      content: newArticle.content || newArticle.summary,
      image: cover,
      images: gallery,
      gallery: gallery,
      tags: newArticle.tags.split(',').map(t => t.trim())
    };
    setData({ ...data, articles: [item, ...(data.articles || [])] });
    setNewArticle({
      title: '', date: '', author: 'ทีมผู้เชี่ยวชาญ GR Group', readTime: '4 นาที',
      summary: '', content: '', image: '/images/garden.jpg', images: ['/images/garden.jpg'],
      tags: 'ดูแลสวน, สาระน่ารู้'
    });
    alert('เพิ่มบทความใหม่เรียบร้อย! อย่าลืมกด "บันทึกการเปลี่ยนแปลงทั้งหมด"');
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('ยืนยันการลบบทความนี้?')) {
      setData({ ...data, articles: data.articles.filter((a: any) => a.id !== id) });
    }
  };

  // Handlers for Hero Banner Slides
  const handleNewHeroSlideUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = await uploadFile(e.target.files[0]);
      if (url) {
        setNewHeroSlide(prev => ({ ...prev, image: url }));
      }
    }
  };

  const handleAddHeroSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeroSlide.title || !newHeroSlide.image) {
      alert('กรุณากรอกหัวข้อแบนเนอร์และเลือกรูปภาพ');
      return;
    }
    const item = {
      id: `slide-${Date.now()}`,
      tag: newHeroSlide.tag || 'บริการแนะนำ',
      title: newHeroSlide.title,
      subtitle: newHeroSlide.subtitle || '',
      badge: newHeroSlide.badge || '',
      image: newHeroSlide.image,
      desktopImage: newHeroSlide.image,
      mobileImage: newHeroSlide.image
    };
    const currentSlides = [...(data.hero?.bannerSlides || [])];
    const updated = [...currentSlides, item];
    setData({
      ...data,
      hero: {
        ...(data.hero || {}),
        bannerSlides: updated
      }
    });
    setNewHeroSlide({ title: '', subtitle: '', tag: '', badge: '', image: '' });
    alert('เพิ่มภาพแบนเนอร์ใหม่เรียบร้อยแล้ว! อย่าลืมกด "บันทึกข้อมูล"');
  };

  const handleDeleteHeroSlide = (index: number) => {
    const currentSlides = data.hero?.bannerSlides || [];
    if (currentSlides.length <= 1) {
      alert('ต้องมีภาพแบนเนอร์อย่างน้อย 1 ภาพในหน้าแรก');
      return;
    }
    if (confirm('ยืนยันการลบภาพแบนเนอร์นี้ออกจากหน้าเว็บ?')) {
      const updated = currentSlides.filter((_: any, idx: number) => idx !== index);
      setData({
        ...data,
        hero: {
          ...(data.hero || {}),
          bannerSlides: updated
        }
      });
    }
  };

  const handleMoveHeroSlide = (index: number, direction: 'up' | 'down') => {
    const currentSlides = [...(data.hero?.bannerSlides || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentSlides.length) return;
    const temp = currentSlides[index];
    currentSlides[index] = currentSlides[targetIndex];
    currentSlides[targetIndex] = temp;
    setData({
      ...data,
      hero: {
        ...(data.hero || {}),
        bannerSlides: currentSlides
      }
    });
  };

  // Handlers for Clients Marquee
  const handleNewClientUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = await uploadFile(e.target.files[0]);
      if (url) {
        setNewClient(prev => ({ ...prev, image: url }));
      }
    }
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name) return;
    const item = {
      name: newClient.name,
      role: newClient.role || 'พันธมิตรโครงการ',
      image: newClient.image || '/images/garden.jpg'
    };
    setData({ ...data, clients: [...(data.clients || []), item] });
    setNewClient({ name: '', role: '', image: '/images/garden.jpg' });
    alert('เพิ่มลูกค้าเรียบร้อย! อย่าลืมกด "บันทึกการเปลี่ยนแปลงทั้งหมด"');
  };

  const handleDeleteClient = (index: number) => {
    if (confirm('ยืนยันการลบลูกค้ารายนี้ออกจากแถบเลื่อน?')) {
      const updated = data.clients.filter((_: any, idx: number) => idx !== index);
      setData({ ...data, clients: updated });
    }
  };

  const handleResetDefaultClients = () => {
    if (confirm('ต้องการรีเซ็ตรายชื่อโลโก้กลับเป็น 20 แบรนด์ชั้นนำตามมาตรฐานใช่หรือไม่?')) {
      const defaultClients = [
        { id: 'noble', name: 'Noble Development', role: 'คอนโดมิเนียม & บ้านเดี่ยว', image: '/images/logos/noble.svg' },
        { id: 'theroom', name: 'The Room', role: 'คอนโดมิเนียมระดับพรีเมียม โดย Land & Houses', image: '/images/logos/theroom.svg' },
        { id: 'ideo', name: 'IDEO Condominium', role: 'คอนโดมิเนียมติดรถไฟฟ้า', image: '/images/logos/ideo.svg' },
        { id: 'wyndham', name: 'WYNDHAM Hotels & Resorts', role: 'โรงแรมและที่พักอาศัยมาตรฐานสากล', image: '/images/logos/wyndham.svg' },
        { id: 'singha', name: 'SINGHA ESTATE', role: 'อสังหาริมทรัพย์ระดับลักชัวรี', image: '/images/logos/singha.svg' },
        { id: 'sansiri-1', name: 'แสนสิริ (Sansiri)', role: 'ผู้นำอสังหาริมทรัพย์ไทย', image: '/images/logos/sansiri.svg' },
        { id: 'lh', name: 'LAND & HOUSES', role: 'บ้านเดี่ยวและคอนโดมิเนียมชั้นนำ', image: '/images/logos/lh.svg' },
        { id: 'origin', name: 'ORIGIN Property', role: 'คอนโดมิเนียมและบ้านคุณภาพ', image: '/images/logos/origin.svg' },
        { id: 'ananda', name: 'ANANDA Development', role: 'คอนโดมิเนียมใจกลางเมือง', image: '/images/logos/ananda.svg' },
        { id: 'scasset', name: 'SC ASSET', role: 'บ้านหรูและคอนโดมิเนียมคุณภาพ', image: '/images/logos/scasset.svg' },
        { id: 'cmc', name: 'CMC GROUP', role: 'เจ้าพระยามหานคร', image: '/images/logos/cmc.svg' },
        { id: 'major', name: 'MAJOR Development', role: 'คอนโดมิเนียมเลี้ยงสัตว์ได้ (Pet-Friendly)', image: '/images/logos/major.svg' },
        { id: 'frasers', name: 'FRASERS Property', role: 'อสังหาริมทรัพย์เพื่อการพาณิชย์และที่อยู่อาศัย', image: '/images/logos/frasers.svg' },
        { id: 'aspace', name: 'a space CONDO ME', role: 'คอนโดมิเนียมสำหรับคนรุ่นใหม่', image: '/images/logos/aspace.svg' },
        { id: 'sansiri-2', name: 'แสนสิริ (Sansiri)', role: 'โครงการบ้านและคอนโดมิเนียม', image: '/images/logos/sansiri.svg' },
        { id: 'ap', name: 'AP THAILAND', role: 'Empower Living ทุกพื้นที่ชีวิต', image: '/images/logos/ap.svg' },
        { id: 'supalai', name: 'SUPALAI', role: 'ศุภาลัย สร้างสรรค์คุณภาพชีวิต', image: '/images/logos/supalai.svg' },
        { id: 'pruksa', name: 'PRUKSA Holding', role: 'พฤกษา ใส่ใจเพื่อทั้งชีวิต', image: '/images/logos/pruksa.svg' },
        { id: 'chewathai', name: 'CHEWATHAI', role: 'ชีวาทัย คอนโดมิเนียมและบ้านเดี่ยว', image: '/images/logos/chewathai.svg' },
        { id: 'parkland', name: 'The Parkland', role: 'เดอะ พาร์คแลนด์ คอนโดมิเนียม', image: '/images/logos/parkland.svg' }
      ];
      setData({ ...data, clients: defaultClients });
      alert('คืนค่า 20 แบรนด์ดังเรียบร้อยแล้ว! อย่าลืมกด "บันทึกการเปลี่ยนแปลงทั้งหมด"');
    }
  };

  // Handlers for Email & LINE Notifications
  const handleTestEmail = async () => {
    const defaultRecipient = data.notifications?.email?.recipientEmails
      ? data.notifications.email.recipientEmails.split(',')[0].trim()
      : 'goldenriverservice@gmail.com';
    const recipient = testEmailRecipient.trim() || defaultRecipient;

    if (!recipient) {
      alert('กรุณาระบุอีเมลผู้รับเพื่อทดสอบ');
      return;
    }

    setTestingEmail(true);
    setTestEmailResult(null);

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient,
          config: data.notifications?.email,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setTestEmailResult({
          success: true,
          message: result.message || 'ส่งอีเมลทดสอบสำเร็จเรียบร้อยแล้ว!',
        });
      } else {
        setTestEmailResult({
          success: false,
          message: result.error || 'เกิดข้อผิดพลาดในการส่งอีเมล',
        });
      }
    } catch (err: any) {
      setTestEmailResult({
        success: false,
        message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้: ' + (err.message || 'Unknown error'),
      });
    } finally {
      setTestingEmail(false);
    }
  };

  const handleLineQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = await uploadFile(e.target.files[0]);
      if (url) {
        setData({
          ...data,
          company: {
            ...data.company,
            lineQrCode: url,
          },
        });
      }
    }
  };

  const applySmtpPreset = (preset: 'gmail' | 'outlook') => {
    const currentEmail = data.notifications?.email || {};
    if (preset === 'gmail') {
      setData({
        ...data,
        notifications: {
          ...data.notifications,
          email: {
            ...currentEmail,
            smtpHost: 'smtp.gmail.com',
            smtpPort: 587,
            smtpSecure: false,
          },
        },
      });
    } else if (preset === 'outlook') {
      setData({
        ...data,
        notifications: {
          ...data.notifications,
          email: {
            ...currentEmail,
            smtpHost: 'smtp.office365.com',
            smtpPort: 587,
            smtpSecure: false,
          },
        },
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3 shadow-xs font-bold text-base tracking-wider">
              GR
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Golden River CMS</h1>
            <p className="text-xs text-slate-500 mt-1">ระบบบริหารจัดการเนื้อหาเว็บไซต์</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 text-center">
                กรุณาระบุรหัส PIN เพื่อเข้าใช้งาน
              </label>
              <input
                type="password"
                maxLength={8}
                placeholder="ระบุรหัส PIN"
                value={pin}
                onChange={(e) => { setPin(e.target.value); setPinError(false); }}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-center text-lg tracking-widest font-mono bg-white"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-rose-500 mt-2 text-center font-medium">
                  รหัส PIN ไม่ถูกต้อง (ทดลองใช้ 8888 หรือ admin123)
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>เข้าสู่ระบบ</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 font-medium transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> กลับสู่หน้าแรกของเว็บไซต์
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navGroups = [
    {
      title: 'ข้อมูลองค์กรและการติดต่อ',
      items: [
        { id: 'inquiries' as TabType, label: 'คำขอใบเสนอราคา', icon: Inbox, count: inquiries.length },
        { id: 'notifications' as TabType, label: 'ระบบแจ้งเตือน (Email / LINE)', icon: Bell },
        { id: 'company' as TabType, label: 'ข้อมูลบริษัทและการติดต่อ', icon: Settings },
      ]
    },
    {
      title: 'เนื้อหาหน้าแรกและบริการ',
      items: [
        { id: 'hero' as TabType, label: 'แบนเนอร์หน้าแรกและสถิติ', icon: Sparkles },
        { id: 'services' as TabType, label: 'บริการหลัก (แม่บ้าน/สวน)', icon: Briefcase, count: data.services?.length },
        { id: 'clients' as TabType, label: 'แบรนด์ผู้พัฒนาโครงการ', icon: Building2, count: data.clients?.length },
        { id: 'background' as TabType, label: 'ภาพพื้นหลังเว็บไซต์', icon: ImageIcon },
      ]
    },
    {
      title: 'ผลงานและการรับประกัน',
      items: [
        { id: 'beforeAfter' as TabType, label: 'เปรียบเทียบผลงาน ก่อน-หลัง', icon: MoveHorizontal, count: data.beforeAfter?.items?.length },
        { id: 'projects' as TabType, label: 'โครงการและผลงาน (Portfolio)', icon: Building, count: data.projects?.length },
        { id: 'guarantees' as TabType, label: 'มาตรฐานและการรับประกัน', icon: Award },
      ]
    },
    {
      title: 'บทความและกิจกรรมเพื่อสังคม',
      items: [
        { id: 'articles' as TabType, label: 'บทความและสาระน่ารู้', icon: BookOpen, count: data.articles?.length },
        { id: 'csr' as TabType, label: 'กิจกรรมเพื่อสังคม (CSR)', icon: Heart, count: data.csr?.length },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Top Navbar - Clean White Enterprise Design */}
      <header className="bg-white text-slate-800 sticky top-0 z-40 border-b border-slate-200 shadow-2xs">
        <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              aria-label="เปิดเมนู"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs sm:text-sm tracking-wider shadow-xs">
              GR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-slate-900">
                  Golden River CMS
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  ระบบจัดการหลังบ้าน
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">บริหารจัดการเนื้อหาและรูปภาพเว็บไซต์ Golden River Service</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 transition-all shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">ดูหน้าเว็บจริง</span>
              <span className="sm:hidden">ดูเว็บ</span>
            </Link>

            <button
              onClick={handleSaveData}
              disabled={loading}
              className="px-4 sm:px-5 py-2 rounded-lg bg-[#0053b5] hover:bg-[#004293] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังบันทึก...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>บันทึกสำเร็จ!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">บันทึกข้อมูล</span>
                  <span className="sm:hidden">บันทึก</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Left Sidebar */}
      <div className="flex-1 flex flex-row relative w-full">
        {/* ========================================================= */}
        {/* LEFT SIDEBAR (DESKTOP)                                    */}
        {/* ========================================================= */}
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 bg-slate-900 text-slate-300 border-r border-slate-800 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-6 select-none shadow-xs">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 px-2 pb-1 border-b border-slate-800 flex items-center justify-between">
            <span>หมวดหมู่เนื้อหา</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-normal">11 ส่วน</span>
          </div>

          <div className="space-y-5">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase px-2 mb-1.5">
                  {group.title}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left group cursor-pointer ' +
                        (isActive
                          ? 'bg-slate-800 text-white font-semibold shadow-xs border-l-2 border-[#0053b5] pl-2.5'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60')
                      }
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={'w-4 h-4 shrink-0 transition-colors ' + (isActive ? 'text-[#3b82f6]' : 'text-slate-500 group-hover:text-slate-300')} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {typeof item.count === 'number' && item.count > 0 && (
                        <span
                          className={
                            'text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ml-1.5 ' +
                            (item.id === 'inquiries'
                              ? 'bg-rose-500 text-white'
                              : isActive
                              ? 'bg-slate-700 text-white'
                              : 'bg-slate-800 text-slate-400 border border-slate-700')
                          }
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        {/* ========================================================= */}
        {/* MOBILE MENU DRAWER (SLIDE-OVER)                           */}
        {/* ========================================================= */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-slate-200 shadow-2xl z-50 p-4 overflow-y-auto flex flex-col space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <ShieldCheck className="w-5 h-5 text-slate-400" />
                  <span>เมนูระบบจัดการ</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                {navGroups.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-1">
                    <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase px-2 mb-1.5">
                      {group.title}
                    </div>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={
                            'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left ' +
                            (isActive
                              ? 'bg-slate-800 text-white font-semibold border-l-2 border-[#0053b5] pl-2.5'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/60')
                          }
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className={'w-4 h-4 shrink-0 ' + (isActive ? 'text-[#3b82f6]' : 'text-slate-500')} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {typeof item.count === 'number' && item.count > 0 && (
                            <span className={'text-[10px] px-2 py-0.5 rounded-full font-semibold ' + (item.id === 'inquiries' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700')}>
                              {item.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </aside>
          </div>
        )}

        {/* ========================================================= */}
        {/* MAIN CONTENT AREA (RIGHT SIDE)                            */}
        {/* ========================================================= */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">

        {/* ========================================================= */}
        {/* TAB 1: INQUIRIES */}
        {/* ========================================================= */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
            <h2 className="text-lg font-bold text-[#0f172a] mb-1">รายการขอใบเสนอราคาจากหน้าเว็บ</h2>
            <p className="text-xs text-slate-500 mb-4">ข้อมูลลูกค้าและนิติบุคคลที่กรอกแบบฟอร์มเข้ามา (พร้อมภาพถ่ายหน้างานที่แนบมา)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[#0f172a] font-semibold bg-slate-50">
                    <th className="p-3">วันที่</th>
                    <th className="p-3">ชื่อผู้ติดต่อ</th>
                    <th className="p-3">เบอร์โทรศัพท์</th>
                    <th className="p-3">บริการที่สนใจ</th>
                    <th className="p-3">รายละเอียด & ภาพหน้างาน</th>
                    <th className="p-3">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-100">
                  {inquiries.length === 0 ? (
                    <tr><td colSpan={6} className="p-6 text-center text-slate-400">ยังไม่มีรายการขอใบเสนอราคา</td></tr>
                  ) : inquiries.map((inq: any) => (
                    <tr key={inq.id} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-400 whitespace-nowrap">
                        {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('th-TH') : '-'}
                      </td>
                      <td className="p-3 font-bold text-[#0f172a]">
                        {inq.name}
                        {inq.projectName && <div className="text-[11px] font-normal text-slate-400">({inq.projectName})</div>}
                      </td>
                      <td className="p-3 text-[#0053b5] font-semibold">{inq.phone}</td>
                      <td className="p-3"><span className="bg-slate-50 text-[#0053b5] border border-slate-200 px-2 py-0.5 rounded font-medium">{inq.service}</span></td>
                      <td className="p-3 max-w-xs">
                        <div className="text-slate-600 line-clamp-2">{inq.message || '-'}</div>
                        {inq.images && inq.images.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setViewingInquiryPhotos(inq.images)}
                            className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-[#0053b5] rounded-md font-bold text-[11px] border border-slate-300 shadow-2xs"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>ดูภาพหน้างาน ({inq.images.length} รูป)</span>
                          </button>
                        )}
                      </td>
                      <td className="p-3">
                        <select value={inq.status || 'pending'} onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)} className="border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700 text-xs">
                          <option value="pending">รอดำเนินการ</option>
                          <option value="contacted">ติดต่อแล้ว</option>
                          <option value="completed">ปิดงานแล้ว</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal for viewing customer attached photos */}
        {viewingInquiryPhotos && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <div className="bg-white rounded-xl max-w-3xl w-full p-6 relative max-h-[85vh] overflow-y-auto border border-slate-300 shadow-2xl">
              <button
                onClick={() => setViewingInquiryPhotos(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-bold text-base text-[#0f172a] mb-1 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#0053b5]" />
                <span>ภาพถ่ายหน้างานที่ลูกค้าแนบมา ({viewingInquiryPhotos.length} รูป)</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">คลิกที่รูปเพื่อเปิดดูขนาดใหญ่ในแท็บใหม่</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {viewingInquiryPhotos.map((url, uIdx) => (
                  <a key={uIdx} href={url} target="_blank" rel="noreferrer" className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 block group relative bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity gap-1">
                      <Eye className="w-4 h-4" /> ดูรูปขนาดเต็ม
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: NOTIFICATIONS (EMAIL & LINE)                         */}
        {/* ========================================================= */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 text-xs">
            {/* EMAIL NOTIFICATIONS CARD */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <h3 className="font-bold text-base text-[#0f172a] flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#0053b5]" />
                    <span>ระบบแจ้งเตือนผ่านอีเมล (Email Notifications)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    เมื่อมีลูกค้าส่งคำขอใบเสนอราคาจากหน้าเว็บ ระบบจะจัดส่งรายละเอียดและรูปภาพเข้าสู่อีเมลทีมงานทันที
                  </p>
                </div>

                {/* Enable / Disable Switch */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="text-xs font-semibold text-slate-700">
                    {data.notifications?.email?.enabled ? (
                      <span className="text-emerald-600 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-4 h-4" /> เปิดใช้งาน
                      </span>
                    ) : (
                      <span className="text-slate-400">ปิดใช้งานอยู่</span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setData({
                        ...data,
                        notifications: {
                          ...(data.notifications || {}),
                          email: {
                            ...(data.notifications?.email || {}),
                            enabled: !data.notifications?.email?.enabled,
                          },
                        },
                      });
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      data.notifications?.email?.enabled ? 'bg-[#0053b5]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        data.notifications?.email?.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-medium text-slate-700 mb-1">
                      อีเมลผู้รับแจ้งเตือน (Recipient Emails) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="goldenriverservice@gmail.com, sale@goldenriver.co.th"
                      value={data.notifications?.email?.recipientEmails || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          notifications: {
                            ...(data.notifications || {}),
                            email: {
                              ...(data.notifications?.email || {}),
                              recipientEmails: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 font-medium"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      สามารถระบุได้มากกว่า 1 อีเมล โดยคั่นด้วยเครื่องหมายจุลภาค (,) เช่น info@goldenriver.co.th, sale@goldenriver.co.th
                    </p>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      ชื่อผู้ส่งที่แสดง (Sender Display Name)
                    </label>
                    <input
                      type="text"
                      placeholder="GR Group Web Notification"
                      value={data.notifications?.email?.senderName || 'GR Group Web Notification'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          notifications: {
                            ...(data.notifications || {}),
                            email: {
                              ...(data.notifications?.email || {}),
                              senderName: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      รูปแบบหัวข้ออีเมล (Subject Template)
                    </label>
                    <input
                      type="text"
                      placeholder="[คำขอใบเสนอราคาใหม่] คุณ {name} - โครงการ {projectName}"
                      value={data.notifications?.email?.subject || '[คำขอใบเสนอราคาใหม่] คุณ {name} - โครงการ {projectName}'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          notifications: {
                            ...(data.notifications || {}),
                            email: {
                              ...(data.notifications?.email || {}),
                              subject: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
                    />
                  </div>
                </div>

                {/* SMTP Configuration Box */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5 text-slate-600" />
                      <span>การตั้งค่าเซิร์ฟเวอร์ส่งอีเมล (Outgoing Mail Server / SMTP)</span>
                    </span>

                    {/* Quick Presets */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500 font-medium">ค่าเริ่มต้นด่วน:</span>
                      <button
                        type="button"
                        onClick={() => applySmtpPreset('gmail')}
                        className="px-2 py-0.5 rounded-md bg-white hover:bg-slate-100 border border-slate-300 text-[11px] font-semibold text-slate-700 shadow-2xs cursor-pointer"
                      >
                        Gmail
                      </button>
                      <button
                        type="button"
                        onClick={() => applySmtpPreset('outlook')}
                        className="px-2 py-0.5 rounded-md bg-white hover:bg-slate-100 border border-slate-300 text-[11px] font-semibold text-slate-700 shadow-2xs cursor-pointer"
                      >
                        Outlook / 365
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        SMTP Host *
                      </label>
                      <input
                        type="text"
                        placeholder="smtp.gmail.com"
                        value={data.notifications?.email?.smtpHost || 'smtp.gmail.com'}
                        onChange={(e) =>
                          setData({
                            ...data,
                            notifications: {
                              ...(data.notifications || {}),
                              email: {
                                ...(data.notifications?.email || {}),
                                smtpHost: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        SMTP Port *
                      </label>
                      <input
                        type="number"
                        placeholder="587"
                        value={data.notifications?.email?.smtpPort ?? 587}
                        onChange={(e) =>
                          setData({
                            ...data,
                            notifications: {
                              ...(data.notifications || {}),
                              email: {
                                ...(data.notifications?.email || {}),
                                smtpPort: parseInt(e.target.value) || 587,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        ความปลอดภัย (Security)
                      </label>
                      <select
                        value={data.notifications?.email?.smtpSecure ? 'ssl' : 'tls'}
                        onChange={(e) =>
                          setData({
                            ...data,
                            notifications: {
                              ...(data.notifications || {}),
                              email: {
                                ...(data.notifications?.email || {}),
                                smtpSecure: e.target.value === 'ssl',
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 cursor-pointer"
                      >
                        <option value="tls">STARTTLS (พอร์ต 587 - แนะนำ)</option>
                        <option value="ssl">SSL / TLS (พอร์ต 465)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block font-medium text-slate-700 mb-1">
                        อีเมลบัญชีผู้ส่ง (Username / Email) *
                      </label>
                      <input
                        type="text"
                        placeholder="your-email@gmail.com"
                        value={data.notifications?.email?.smtpUser || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            notifications: {
                              ...(data.notifications || {}),
                              email: {
                                ...(data.notifications?.email || {}),
                                smtpUser: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium text-slate-700 mb-1">
                        รหัสผ่านแอป / App Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showSmtpPassword ? 'text' : 'password'}
                          placeholder="xxxx xxxx xxxx xxxx"
                          value={data.notifications?.email?.smtpPass || ''}
                          onChange={(e) =>
                            setData({
                              ...data,
                              notifications: {
                                ...(data.notifications || {}),
                                email: {
                                  ...(data.notifications?.email || {}),
                                  smtpPass: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-3 py-1.5 pr-10 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showSmtpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-[10.5px] text-slate-500 mt-1">
                        💡 หากใช้ Gmail ต้องเปิด 2-Step Verification และสร้าง <strong>App Password (รหัสผ่านสำหรับแอป 16 หลัก)</strong> จากบัญชี Google
                      </p>
                    </div>
                  </div>
                </div>

                {/* TEST EMAIL TRIGGER BOX */}
                <div className="p-4 bg-blue-50/60 border border-blue-200/80 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-[#0053b5]" />
                      <span>ทดสอบการเชื่อมต่อส่งอีเมล (Send Test Email)</span>
                    </span>
                    <span className="text-[11px] text-slate-500">ทดสอบส่งจริงเพื่อยืนยันความถูกต้อง</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="email"
                      placeholder="ระบุอีเมลที่จะให้ส่งข้อความทดสอบไปถึง"
                      value={testEmailRecipient}
                      onChange={(e) => setTestEmailRecipient(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 w-full"
                    />
                    <button
                      type="button"
                      onClick={handleTestEmail}
                      disabled={testingEmail}
                      className="w-full sm:w-auto px-4 py-1.5 bg-[#0053b5] hover:bg-[#004293] text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-2xs cursor-pointer"
                    >
                      {testingEmail ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>กำลังทดสอบส่ง...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>กดส่งอีเมลทดสอบ</span>
                        </>
                      )}
                    </button>
                  </div>

                  {testEmailResult && (
                    <div
                      className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                        testEmailResult.success
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {testEmailResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-semibold">
                          {testEmailResult.success ? 'สำเร็จ: ' : 'ไม่สำเร็จ: '}
                        </span>
                        <span>{testEmailResult.message}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* LINE INTEGRATION CARD */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-[#0f172a] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#06C755]" />
                  <span>การเชื่อมต่อระบบ LINE Official Account</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  จัดการ LINE ID, ลิงก์ตรงสำหรับเพิ่มเพื่อน, และรูปภาพ QR Code ที่แสดงในการ์ด &quot;สแกน QR Code ขอใบเสนอราคา&quot; หน้าแรกของเว็บไซต์
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    LINE Official ID *
                  </label>
                  <input
                    type="text"
                    placeholder="@goldenriver"
                    value={data.company?.lineId || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        company: {
                          ...data.company,
                          lineId: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 font-semibold"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    เช่น @goldenriver (ระบบจะใส่เครื่องหมาย @ ให้อัตโนมัติหากไม่ได้พิมพ์)
                  </p>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    ลิงก์เพิ่มเพื่อนใน LINE ทันที (Direct LINE URL) *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="https://line.me/R/ti/p/@goldenriver หรือ https://lin.ee/xxxxx"
                      value={data.company?.lineUrl || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          company: {
                            ...data.company,
                            lineUrl: e.target.value,
                          },
                        })
                      }
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 font-medium"
                    />
                    {data.company?.lineUrl && (
                      <a
                        href={data.company.lineUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium shrink-0 flex items-center gap-1 transition-colors border border-slate-300 shadow-2xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>เปิดดู</span>
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    ลิงก์ตรงสำหรับปุ่ม &quot;กดเพิ่มเพื่อนใน LINE ทันที&quot; และเมื่อผู้ใช้คลิกที่รูป QR Code
                  </p>
                </div>

                {/* LINE QR Code Image Upload & Preview */}
                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <label className="block font-medium text-slate-700 mb-2">
                    รูปภาพ LINE QR Code (QR Code Image)
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-28 h-28 p-2 rounded-xl border-2 border-slate-200 bg-white shadow-2xs flex items-center justify-center shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={data.company?.lineQrCode || '/images/line-qr-code.svg'}
                        alt="LINE QR Code Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="/images/line-qr-code.svg หรือ URL รูปภาพ"
                          value={data.company?.lineQrCode || ''}
                          onChange={(e) =>
                            setData({
                              ...data,
                              company: {
                                ...data.company,
                                lineQrCode: e.target.value,
                              },
                            })
                          }
                          className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
                        />
                        <input
                          type="file"
                          ref={lineQrFileInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={handleLineQrUpload}
                        />
                        <button
                          type="button"
                          onClick={() => lineQrFileInputRef.current?.click()}
                          disabled={uploading}
                          className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg font-medium shrink-0 flex items-center gap-1 transition-colors border border-slate-300 shadow-2xs cursor-pointer"
                        >
                          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                          <span>อัปโหลดรูป QR Code ใหม่</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        สามารถอัปโหลดไฟล์ภาพ QR Code จริงของ LINE Official Account ทางการของบริษัท (รองรับ .png, .jpg, .svg)
                      </p>
                    </div>
                  </div>
                </div>

                {/* LINE Notify Token (Optional) */}
                <div className="sm:col-span-2 pt-3 border-t border-slate-100">
                  <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#06C755]"></span>
                          <span>การแจ้งเตือนเข้ากลุ่ม LINE ผ่าน LINE Notify (ทางเลือกเพิ่มเติม)</span>
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          ส่งแจ้งเตือนเข้ากลุ่ม LINE ของทีมงานเมื่อมีคำขอใหม่
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-700">
                          {data.notifications?.line?.enabled ? (
                            <span className="text-emerald-700 font-bold">เปิดใช้งาน</span>
                          ) : (
                            <span className="text-slate-400">ปิด</span>
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setData({
                              ...data,
                              notifications: {
                                ...(data.notifications || {}),
                                line: {
                                  ...(data.notifications?.line || {}),
                                  enabled: !data.notifications?.line?.enabled,
                                },
                              },
                            });
                          }}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            data.notifications?.line?.enabled ? 'bg-[#06C755]' : 'bg-slate-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              data.notifications?.line?.enabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        LINE Notify Access Token
                      </label>
                      <input
                        type="text"
                        placeholder="ระบุ LINE Notify Token หากต้องการให้แจ้งเตือนเข้ากลุ่ม LINE"
                        value={data.notifications?.line?.notifyToken || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            notifications: {
                              ...(data.notifications || {}),
                              line: {
                                ...(data.notifications?.line || {}),
                                notifyToken: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: HERO & STATS */}
        {/* ========================================================= */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
              <h3 className="font-bold text-base text-[#0f172a] border-b border-slate-100 pb-2">แก้ไขข้อความแบนเนอร์หลัก (Hero Section)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-[#0f172a] mb-1">หัวข้อหลัก (Headline Title)</label>
                  <input
                    type="text"
                    value={data.hero?.title || ''}
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-[#0f172a]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-medium text-[#0f172a] mb-1">คำบรรยายหลัก (Subtitle Description)</label>
                  <textarea
                    rows={3}
                    value={data.hero?.subtitle || data.company?.description || ''}
                    onChange={(e) => setData({
                      ...data,
                      hero: { ...data.hero, subtitle: e.target.value },
                      company: { ...data.company, description: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#0f172a] mb-1">ข้อความปุ่มกดหลัก (Primary CTA)</label>
                  <input
                    type="text"
                    value={data.hero?.ctaText || 'ขอใบเสนอราคาด่วน'}
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, ctaText: e.target.value } })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#0f172a] mb-1">ข้อความปุ่มกดรอง (Secondary CTA)</label>
                  <input
                    type="text"
                    value={data.hero?.secondaryCtaText || 'ดูผลงานโครงการจริง'}
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, secondaryCtaText: e.target.value } })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* ADD NEW HERO BANNER SLIDE FORM */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#0053b5]" />
                    <span>เพิ่มภาพแบนเนอร์สไลด์ใหม่ (Add Hero Banner)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    สามารถเพิ่มภาพแบนเนอร์ได้ตามต้องการ ภาพจะเลื่อนสไลด์อัตโนมัติบนหน้าแรกของเว็บไซต์
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddHeroSlide} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">หัวข้อหลักของแบนเนอร์ *</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น บริการทำความสะอาดอาคารสำนักงานและเช็ดกระจกสูง"
                      value={newHeroSlide.title}
                      onChange={(e) => setNewHeroSlide({ ...newHeroSlide, title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">ป้ายแท็กบริการ (Tag บนปุ่มล่าง)</label>
                    <input
                      type="text"
                      placeholder="เช่น งานเช็ดกระจกสูง หรือ งานแม่บ้านอาคาร"
                      value={newHeroSlide.tag}
                      onChange={(e) => setNewHeroSlide({ ...newHeroSlide, tag: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-medium text-slate-700 mb-1">คำบรรยายใต้หัวข้อ (Subtitle)</label>
                    <textarea
                      rows={2}
                      placeholder="เช่น ทีมงานมืออาชีพ ผ่านการตรวจประวัติ 100% พร้อมอุปกรณ์และน้ำยาเฉพาะทาง..."
                      value={newHeroSlide.subtitle}
                      onChange={(e) => setNewHeroSlide({ ...newHeroSlide, subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">ป้ายกำกับรับประกัน (Badge)</label>
                    <input
                      type="text"
                      placeholder="เช่น ทีมงานมืออาชีพ ตรวจประวัติ 100%"
                      value={newHeroSlide.badge}
                      onChange={(e) => setNewHeroSlide({ ...newHeroSlide, badge: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                    />
                  </div>
                </div>

                {/* Banner Photo Upload */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 shrink-0 shadow-xs flex items-center justify-center">
                    {newHeroSlide.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={newHeroSlide.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5 w-full">
                    <label className="block font-medium text-slate-700">รูปภาพแบนเนอร์ *</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        placeholder="URL รูปภาพ หรือกดปุ่มอัปโหลดรูปภาพ"
                        value={newHeroSlide.image}
                        onChange={(e) => setNewHeroSlide({ ...newHeroSlide, image: e.target.value })}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
                      />
                      <input
                        type="file"
                        ref={heroSlideFileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleNewHeroSlideUpload}
                      />
                      <button
                        type="button"
                        onClick={() => heroSlideFileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg font-medium shrink-0 flex items-center gap-1 transition-colors border border-slate-300 shadow-2xs cursor-pointer"
                      >
                        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>อัปโหลดรูป</span>
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#0053b5] hover:bg-[#004293] text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-xs cursor-pointer self-end"
                  >
                    <Plus className="w-4 h-4" />
                    <span>เพิ่มแบนเนอร์นี้</span>
                  </button>
                </div>
              </form>
            </div>

            {/* EXISTING HERO BANNER SLIDES LIST */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#0053b5]" />
                    <span>รายการภาพแบนเนอร์ทั้งหมดในระบบ ({(data.hero?.bannerSlides || []).length} ภาพ)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ภาพแบนเนอร์ทั้งหมดจะเลื่อนสไลด์อัตโนมัติบนหน้าแรก สามารถแก้ไขข้อความ เปลี่ยนรูป สลับลำดับ หรือลบได้
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {(data.hero?.bannerSlides || []).map((slide: any, bIdx: number) => {
                  const heroBannerInputId = `hero-banner-file-${bIdx}`;
                  const totalSlides = (data.hero?.bannerSlides || []).length;
                  return (
                    <div
                      key={slide.id || bIdx}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between gap-3 hover:border-slate-300 transition-colors shadow-2xs"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                          <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-md bg-slate-900 text-white flex items-center justify-center text-[10px]">
                              {bIdx + 1}
                            </span>
                            <span>{slide.tag || `สไลด์ที่ ${bIdx + 1}`}</span>
                          </span>

                          <div className="flex items-center gap-1">
                            {/* Reorder Buttons */}
                            <button
                              type="button"
                              onClick={() => handleMoveHeroSlide(bIdx, 'up')}
                              disabled={bIdx === 0}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer"
                              title="เลื่อนขึ้น"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveHeroSlide(bIdx, 'down')}
                              disabled={bIdx === totalSlides - 1}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer"
                              title="เลื่อนลง"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteHeroSlide(bIdx)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1 cursor-pointer"
                              title="ลบแบนเนอร์นี้"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Image Preview & Upload Overlay */}
                        <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-slate-200 bg-slate-900 group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/garden.jpg';
                            }}
                          />
                          <label
                            htmlFor={heroBannerInputId}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[11px] font-medium gap-1"
                          >
                            <Upload className="w-4 h-4 text-white" />
                            <span>คลิกเปลี่ยนรูปภาพ</span>
                          </label>
                          <input
                            id={heroBannerInputId}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                const url = await uploadFile(e.target.files[0]);
                                if (url) {
                                  const currentSlides = [...(data.hero?.bannerSlides || [])];
                                  if (!currentSlides[bIdx]) currentSlides[bIdx] = { ...slide };
                                  currentSlides[bIdx].image = url;
                                  currentSlides[bIdx].desktopImage = url;
                                  currentSlides[bIdx].mobileImage = url;
                                  setData({
                                    ...data,
                                    hero: {
                                      ...(data.hero || {}),
                                      bannerSlides: currentSlides
                                    }
                                  });
                                }
                              }
                            }}
                          />
                        </div>

                        {/* Image URL & File button */}
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <input
                            type="text"
                            value={slide.image}
                            onChange={(e) => {
                              const currentSlides = [...(data.hero?.bannerSlides || [])];
                              if (!currentSlides[bIdx]) currentSlides[bIdx] = { ...slide };
                              currentSlides[bIdx].image = e.target.value;
                              currentSlides[bIdx].desktopImage = e.target.value;
                              setData({ ...data, hero: { ...(data.hero || {}), bannerSlides: currentSlides } });
                            }}
                            className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg text-[10px] bg-white text-slate-600 focus:outline-none focus:border-slate-900"
                            placeholder="URL รูปภาพ"
                          />
                          <label
                            htmlFor={heroBannerInputId}
                            className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-medium text-[10px] cursor-pointer shrink-0 transition-colors shadow-2xs"
                          >
                            เลือกไฟล์
                          </label>
                        </div>

                        {/* Title, Subtitle, Tag inputs */}
                        <div className="space-y-2 pt-1">
                          <div>
                            <label className="block text-[10px] text-slate-500 font-medium mb-1">
                              ป้ายแท็กบริการ (Tag)
                            </label>
                            <input
                              type="text"
                              value={slide.tag || ''}
                              onChange={(e) => {
                                const currentSlides = [...(data.hero?.bannerSlides || [])];
                                if (!currentSlides[bIdx]) currentSlides[bIdx] = { ...slide };
                                currentSlides[bIdx].tag = e.target.value;
                                setData({ ...data, hero: { ...(data.hero || {}), bannerSlides: currentSlides } });
                              }}
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs focus:outline-none focus:border-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-medium mb-1">
                              หัวข้อหลัก (Title)
                            </label>
                            <input
                              type="text"
                              value={slide.title || ''}
                              onChange={(e) => {
                                const currentSlides = [...(data.hero?.bannerSlides || [])];
                                if (!currentSlides[bIdx]) currentSlides[bIdx] = { ...slide };
                                currentSlides[bIdx].title = e.target.value;
                                setData({ ...data, hero: { ...(data.hero || {}), bannerSlides: currentSlides } });
                              }}
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-medium mb-1">
                              คำบรรยายใต้หัวข้อ (Subtitle)
                            </label>
                            <textarea
                              rows={2}
                              value={slide.subtitle || ''}
                              onChange={(e) => {
                                const currentSlides = [...(data.hero?.bannerSlides || [])];
                                if (!currentSlides[bIdx]) currentSlides[bIdx] = { ...slide };
                                currentSlides[bIdx].subtitle = e.target.value;
                                setData({ ...data, hero: { ...(data.hero || {}), bannerSlides: currentSlides } });
                              }}
                              placeholder="คำบรรยายย่อยสำหรับสไลด์นี้..."
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700 text-xs leading-relaxed focus:outline-none focus:border-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-medium mb-1">
                              ป้ายกำกับรับประกัน (Badge)
                            </label>
                            <input
                              type="text"
                              value={slide.badge || ''}
                              onChange={(e) => {
                                const currentSlides = [...(data.hero?.bannerSlides || [])];
                                if (!currentSlides[bIdx]) currentSlides[bIdx] = { ...slide };
                                currentSlides[bIdx].badge = e.target.value;
                                setData({ ...data, hero: { ...(data.hero || {}), bannerSlides: currentSlides } });
                              }}
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs focus:outline-none focus:border-slate-900"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4 STATS EDITING */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 text-xs">
              <h3 className="font-bold text-base text-[#0f172a] border-b border-slate-100 pb-2 mb-4">แก้ไข 4 ตัวเลขสถิติความสำเร็จ (Company Stats)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.company?.stats?.map((st: any, sIdx: number) => (
                  <div key={sIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-[#0053b5]">สถิติที่ {sIdx + 1}</span>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-semibold mb-0.5">ตัวเลข (Value)</label>
                      <input
                        type="text"
                        value={st.value}
                        onChange={(e) => {
                          const updated = [...data.company.stats];
                          updated[sIdx].value = e.target.value;
                          setData({ ...data, company: { ...data.company, stats: updated } });
                        }}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-extrabold text-[#0f172a] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-semibold mb-0.5">ชื่อหัวข้อ (Label)</label>
                      <input
                        type="text"
                        value={st.label}
                        onChange={(e) => {
                          const updated = [...data.company.stats];
                          updated[sIdx].label = e.target.value;
                          setData({ ...data, company: { ...data.company, stats: updated } });
                        }}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-semibold mb-0.5">คำอธิบายเพิ่มเติม (Detail)</label>
                      <input
                        type="text"
                        value={st.detail}
                        onChange={(e) => {
                          const updated = [...data.company.stats];
                          updated[sIdx].detail = e.target.value;
                          setData({ ...data, company: { ...data.company, stats: updated } });
                        }}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px] text-slate-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SERVICES */}
        {/* ========================================================= */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6 text-xs">
              <h3 className="font-bold text-base text-[#0f172a] border-b border-slate-100 pb-2">แก้ไขบริการหลักทั้ง 3 บริการ (พร้อมอัปโหลดภาพและรายการขอบเขตงาน)</h3>
              {data.services?.map((svc: any, idx: number) => (
                <div key={svc.id} className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <span className="font-extrabold text-sm text-[#0f172a] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0f172a] text-white text-xs flex items-center justify-center">{idx + 1}</span>
                      <span>{svc.title} ({svc.id})</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-semibold text-[#0053b5]">Badge:</label>
                      <input
                        type="text"
                        value={svc.badge || ''}
                        onChange={(e) => {
                          const updated = [...data.services];
                          updated[idx].badge = e.target.value;
                          setData({ ...data, services: updated });
                        }}
                        className="px-2.5 py-1 border border-slate-200 rounded-lg bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Left: Text Details */}
                    <div className="lg:col-span-8 space-y-3">
                      <div>
                        <label className="block font-medium text-[#0f172a] mb-1">ชื่อบริการภาษาไทย</label>
                        <input
                          type="text"
                          value={svc.title}
                          onChange={(e) => {
                            const updated = [...data.services];
                            updated[idx].title = e.target.value;
                            setData({ ...data, services: updated });
                          }}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-bold text-[#0f172a]"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-[#0f172a] mb-1">คำอธิบายย่อ (Short Description)</label>
                        <input
                          type="text"
                          value={svc.shortDesc || ''}
                          onChange={(e) => {
                            const updated = [...data.services];
                            updated[idx].shortDesc = e.target.value;
                            setData({ ...data, services: updated });
                          }}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-[#0f172a] mb-1">คำอธิบายฉบับเต็ม (Full Description)</label>
                        <textarea
                          rows={3}
                          value={svc.fullDesc || ''}
                          onChange={(e) => {
                            const updated = [...data.services];
                            updated[idx].fullDesc = e.target.value;
                            setData({ ...data, services: updated });
                          }}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Right: Service Image with Upload */}
                    <div className="lg:col-span-4 bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
                      <div>
                        <label className="block font-semibold text-[#0f172a] mb-1.5"> รูปภาพบริการ</label>
                        <div className="aspect-[16/10] rounded-lg overflow-hidden bg-slate-100 border border-slate-200 relative group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={svc.image} alt={svc.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/garden.jpg'; }} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="cursor-pointer block text-center py-2 px-3 bg-[#0053b5] hover:bg-[#004293] text-white rounded-lg font-semibold transition-colors">
                          <Upload className="w-3.5 h-3.5 inline mr-1" />
                          <span>เปลี่ยนรูปบริการนี้</span>
                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              const url = await uploadFile(e.target.files[0]);
                              if (url) {
                                const updated = [...data.services];
                                updated[idx].image = url;
                                setData({ ...data, services: updated });
                                alert('อัปเดตรูปบริการเรียบร้อย!');
                              }
                            }
                          }} />
                        </label>
                        <input
                          type="text"
                          value={svc.image}
                          onChange={(e) => {
                            const updated = [...data.services];
                            updated[idx].image = e.target.value;
                            setData({ ...data, services: updated });
                          }}
                          className="w-full px-2 py-1 border border-slate-200 rounded text-[11px] bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subservices Checklist */}
                  <div className="pt-3 border-t border-slate-200">
                    <label className="block font-bold text-[#0053b5] mb-2">ขอบเขตงานย่อย 5 รายการ (Scope of Work)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {svc.subServices?.map((sub: any, sIdx: number) => (
                        <div key={sIdx} className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                          <input
                            type="text"
                            value={sub.name}
                            onChange={(e) => {
                              const updated = [...data.services];
                              updated[idx].subServices[sIdx].name = e.target.value;
                              setData({ ...data, services: updated });
                            }}
                            className="w-full px-2 py-1 border border-slate-200 rounded font-semibold text-xs text-[#0f172a]"
                          />
                          <input
                            type="text"
                            value={sub.desc}
                            onChange={(e) => {
                              const updated = [...data.services];
                              updated[idx].subServices[sIdx].desc = e.target.value;
                              setData({ ...data, services: updated });
                            }}
                            className="w-full px-2 py-0.5 border border-slate-200 rounded text-[11px] text-slate-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: BEFORE & AFTER */}
        {/* ========================================================= */}
        {activeTab === 'beforeAfter' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6 text-xs">
            <h3 className="font-bold text-base text-[#0f172a] border-b border-slate-100 pb-2">แก้ไขส่วนเปรียบเทียบผลงาน ก่อน-หลัง (Before & After)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#0f172a] mb-1">หัวข้อหลัก (Title)</label>
                <input
                  type="text"
                  value={data.beforeAfter?.title || 'เปรียบเทียบผลลัพธ์ ก่อน และ หลัง'}
                  onChange={(e) => setData({ ...data, beforeAfter: { ...data.beforeAfter, title: e.target.value } })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-[#0f172a]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#0f172a] mb-1">คำบรรยายย่อ (Subtitle)</label>
                <input
                  type="text"
                  value={data.beforeAfter?.subtitle || ''}
                  onChange={(e) => setData({ ...data, beforeAfter: { ...data.beforeAfter, subtitle: e.target.value } })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            {/* Before and After Image Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* BEFORE IMAGE */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700"> รูปก่อนดูแล (Before Image)</span>
                  <input
                    type="text"
                    value={data.beforeAfter?.beforeLabel || 'ก่อนเข้าดูแล'}
                    onChange={(e) => setData({ ...data, beforeAfter: { ...data.beforeAfter, beforeLabel: e.target.value } })}
                    className="px-2 py-0.5 border border-slate-200 rounded text-[11px] font-semibold text-slate-600 bg-white"
                  />
                </div>
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-200 border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.beforeAfter?.beforeImage} alt="Before" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/garden-before.jpg'; }} />
                </div>
                <input type="file" ref={beforeImgInputRef} accept="image/*" className="hidden" onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const url = await uploadFile(e.target.files[0]);
                    if (url) setData({ ...data, beforeAfter: { ...data.beforeAfter, beforeImage: url } });
                  }
                }} />
                <button type="button" onClick={() => beforeImgInputRef.current?.click()} className="w-full py-2 bg-[#0053b5] hover:bg-[#004293] text-white rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5" /> <span>อัปโหลดรูปภาพ Before จากเครื่อง</span>
                </button>
                <input
                  type="text"
                  placeholder="หรือใส่ลิงก์รูปภาพ Before โดยตรง..."
                  value={data.beforeAfter?.beforeImage || ''}
                  onChange={(e) => setData({ ...data, beforeAfter: { ...data.beforeAfter, beforeImage: e.target.value } })}
                  className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] bg-white text-slate-600"
                />
              </div>

              {/* AFTER IMAGE */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0053b5]"> รูปหลังดูแล (After Image)</span>
                  <input
                    type="text"
                    value={data.beforeAfter?.afterLabel || 'หลังปรับปรุงโดย GR Group'}
                    onChange={(e) => setData({ ...data, beforeAfter: { ...data.beforeAfter, afterLabel: e.target.value } })}
                    className="px-2 py-0.5 border border-slate-200 rounded text-[11px] font-semibold text-[#0053b5] bg-white"
                  />
                </div>
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-200 border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.beforeAfter?.afterImage} alt="After" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/garden-after.jpg'; }} />
                </div>
                <input type="file" ref={afterImgInputRef} accept="image/*" className="hidden" onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const url = await uploadFile(e.target.files[0]);
                    if (url) setData({ ...data, beforeAfter: { ...data.beforeAfter, afterImage: url } });
                  }
                }} />
                <button type="button" onClick={() => afterImgInputRef.current?.click()} className="w-full py-2 bg-[#0f172a] hover:bg-[#0053b5] text-white rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-white" /> <span>อัปโหลดรูปภาพ After จากเครื่อง</span>
                </button>
                <input
                  type="text"
                  placeholder="หรือใส่ลิงก์รูปภาพ After โดยตรง..."
                  value={data.beforeAfter?.afterImage || ''}
                  onChange={(e) => setData({ ...data, beforeAfter: { ...data.beforeAfter, afterImage: e.target.value } })}
                  className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] bg-white text-slate-600"
                />
              </div>
            </div>

            {/* 3 Feature Highlights Editing (กล่องจุดเด่น 3 กล่องด้านล่าง) */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#0f172a] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0053b5]" />
                  <span>แก้ไขข้อความจุดเด่น 3 กล่องด้านล่าง (Key Highlights)</span>
                </h4>
                <span className="text-[11px] text-slate-500">แสดงผลด้านล่างของแถบสไลเดอร์เปรียบเทียบ</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {(data.beforeAfter?.features || [
                  { title: 'ฟื้นฟูสภาพดินและสนามหญ้า', desc: 'แก้ปัญหาหญ้าตาย ดินแน่น และวัชพืชสะสม' },
                  { title: 'ตัดแต่งทรงพุ่มตามหลักรุกขกรรม', desc: 'เปิดทัศนียภาพ รับแสงแดด และเพิ่มความปลอดภัย' },
                  { title: 'เพิ่มมูลค่าให้โครงการระยะยาว', desc: 'พื้นที่ส่วนกลางน่าอยู่ สะอาด และสร้างความประทับใจ' }
                ]).map((feat: any, fIdx: number) => (
                  <div key={fIdx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#0f172a] text-white font-bold flex items-center justify-center text-[10px]">
                        {fIdx + 1}
                      </span>
                      <span className="font-bold text-[#0053b5] text-xs">กล่องจุดเด่นที่ {fIdx + 1}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">หัวข้อจุดเด่น</label>
                      <input
                        type="text"
                        value={feat.title}
                        onChange={(e) => {
                          const currentFeats = [...(data.beforeAfter?.features || [
                            { title: 'ฟื้นฟูสภาพดินและสนามหญ้า', desc: 'แก้ปัญหาหญ้าตาย ดินแน่น และวัชพืชสะสม' },
                            { title: 'ตัดแต่งทรงพุ่มตามหลักรุกขกรรม', desc: 'เปิดทัศนียภาพ รับแสงแดด และเพิ่มความปลอดภัย' },
                            { title: 'เพิ่มมูลค่าให้โครงการระยะยาว', desc: 'พื้นที่ส่วนกลางน่าอยู่ สะอาด และสร้างความประทับใจ' }
                          ])];
                          currentFeats[fIdx].title = e.target.value;
                          setData({
                            ...data,
                            beforeAfter: { ...data.beforeAfter, features: currentFeats }
                          });
                        }}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-bold text-[#0f172a] text-xs bg-white"
                        placeholder="เช่น ฟื้นฟูสภาพดินและสนามหญ้า"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">คำอธิบายย่อย</label>
                      <input
                        type="text"
                        value={feat.desc}
                        onChange={(e) => {
                          const currentFeats = [...(data.beforeAfter?.features || [
                            { title: 'ฟื้นฟูสภาพดินและสนามหญ้า', desc: 'แก้ปัญหาหญ้าตาย ดินแน่น และวัชพืชสะสม' },
                            { title: 'ตัดแต่งทรงพุ่มตามหลักรุกขกรรม', desc: 'เปิดทัศนียภาพ รับแสงแดด และเพิ่มความปลอดภัย' },
                            { title: 'เพิ่มมูลค่าให้โครงการระยะยาว', desc: 'พื้นที่ส่วนกลางน่าอยู่ สะอาด และสร้างความประทับใจ' }
                          ])];
                          currentFeats[fIdx].desc = e.target.value;
                          setData({
                            ...data,
                            beforeAfter: { ...data.beforeAfter, features: currentFeats }
                          });
                        }}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px] text-slate-600 bg-white"
                        placeholder="เช่น แก้ปัญหาหญ้าตาย ดินแน่น..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: PROJECTS (UP TO 10 PHOTOS PER PROJECT) */}
        {/* ========================================================= */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Add Project Form with up to 10 photos */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-1">
                <h3 className="font-bold text-base text-[#0f172a]">+ เพิ่มโครงการใหม่เข้าระบบ</h3>
                <span className="text-[11px] font-bold text-[#0053b5] bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
                   ใส่รูปได้สูงสุด 10 รูปต่อโครงการ
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">กรอกข้อมูลและเลือกรูปภาพผลงานโครงการจริงได้สูงสุด 10 รูป (คลิกเลือกพร้อมกันได้หลายรูป)</p>

              <form onSubmit={handleAddProject} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-[#0f172a] mb-1">ชื่อโครงการ *</label>
                  <input type="text" required placeholder="เช่น เดอะ รูม สุขุมวิท 69" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-medium text-[#0f172a] mb-1">หมวดหมู่โครงการ</label>
                  <select value={newProject.category} onChange={(e) => setNewProject({ ...newProject, category: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white">
                    <option value="condo">คอนโดมิเนียม</option>
                    <option value="luxury">คอนโดระดับลักชัวรี</option>
                    <option value="housing">หมู่บ้านจัดสรร</option>
                    <option value="commercial">โรงแรม / อาคารพาณิชย์</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#0f172a] mb-1">ทำเล / ที่ตั้ง</label>
                  <input type="text" placeholder="เช่น สุขุมวิท 69 ติด BTS พระโขนง" value={newProject.location} onChange={(e) => setNewProject({ ...newProject, location: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-medium text-[#0f172a] mb-1">บริการที่เข้าดูแล (คั่นด้วยจุลภาค , )</label>
                  <input type="text" placeholder="เช่น ดูแลสวน, ดูแลสระว่ายน้ำ" value={newProject.services} onChange={(e) => setNewProject({ ...newProject, services: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-medium text-[#0f172a] mb-1">จุดเด่นโครงการ (Highlight)</label>
                  <input type="text" placeholder="เช่น คอนโดมิเนียมระดับพรีเมียมใจกลางเมือง..." value={newProject.highlight} onChange={(e) => setNewProject({ ...newProject, highlight: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                </div>

                {/* 10 Photos Multi-Upload Box */}
                <div className="sm:col-span-2 bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-[#0f172a] flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#0053b5]" />
                      <span>รูปภาพโครงการ (ใส่ได้สูงสุด 10 รูป)</span>
                    </label>
                    <span className="text-[11px] font-bold text-[#0053b5] bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                      {newProject.images.length} / 10 รูป
                    </span>
                  </div>

                  {/* Thumbnail gallery preview with cover indicator and delete */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {newProject.images.map((imgUrl, imgIdx) => (
                      <div key={imgIdx} className="aspect-[4/3] rounded-xl overflow-hidden relative border-2 border-slate-200 group bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        {imgIdx === 0 ? (
                          <div className="absolute top-1.5 left-1.5 bg-[#0053b5] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-current" /> หน้าปก
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetNewProjectCover(imgIdx)}
                            className="absolute top-1.5 left-1.5 bg-black/60 hover:bg-[#0053b5] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            title="คลิกเพื่อตั้งเป็นรูปหน้าปก"
                          >
                            ตั้งเป็นหน้าปก
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveNewProjectImage(imgIdx)}
                          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors"
                          title="ลบรูปนี้"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {newProject.images.length < 10 && (
                    <div className="flex items-center gap-3 pt-1">
                      <input
                        type="file"
                        ref={projectFileInputRef}
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleNewProjectUpload(e.target.files);
                          }
                        }}
                      />
                      <button
                        type="button"
                        disabled={uploading}
                        onClick={() => projectFileInputRef.current?.click()}
                        className="px-4 py-2 bg-[#0053b5] hover:bg-[#004293] disabled:bg-slate-300 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-xs transition-all text-xs"
                      >
                        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>{uploading ? 'กำลังอัปโหลด...' : '+ เพิ่มรูปภาพโครงการ (เลือกได้หลายรูป)'}</span>
                      </button>
                      <span className="text-[11px] text-slate-400">เลือกรูปได้ทีละหลายรูป (สูงสุด 10 รูป)</span>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2 flex justify-end">
                  <button type="submit" className="px-5 py-2.5 bg-[#0f172a] hover:bg-[#0053b5] text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-xs transition-colors">
                    <Plus className="w-3.5 h-3.5 text-white" />
                    <span>เพิ่มโครงการเข้าสู่เว็บไซต์</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Projects List with Full 10-Photo Gallery Manager */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-[#0f172a]">รายการโครงการทั้งหมดในระบบ ({data.projects?.length})</h3>
                <span className="text-xs text-slate-500">สามารถเพิ่ม/ลบรูปในแต่ละโครงการได้สูงสุด 10 รูป</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
                {data.projects?.map((proj: any, pIdx: number) => {
                  const galleryList: string[] = (proj.gallery && proj.gallery.length > 0) ? proj.gallery : [proj.image];
                  return (
                    <div key={proj.id} className="p-4 border border-slate-200 rounded-2xl flex flex-col justify-between bg-slate-50 hover:bg-white transition-all space-y-3 shadow-2xs">
                      <div>
                        {/* Header info */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] text-[#0053b5] font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                            {proj.categoryName}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                               {galleryList.length}/10 รูป
                            </span>
                            <button onClick={() => handleDeleteProject(proj.id)} className="text-slate-400 hover:text-rose-600 p-1" title="ลบโครงการ">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Main Cover Image */}
                        <div className="aspect-[16/10] rounded-xl overflow-hidden mb-2.5 bg-slate-100 relative group border border-slate-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/garden.jpg'; }} />
                          <div className="absolute top-2 left-2 bg-[#0f172a]/85 text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                            <Star className="w-3 h-3 fill-gold-400" /> รูปหน้าปก
                          </div>
                        </div>

                        {/* Gallery Thumbnails Strip (Up to 10 photos) */}
                        <div className="space-y-1.5 mb-3 bg-white p-2.5 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-slate-700 flex items-center gap-1">
                              <ImageIcon className="w-3 h-3 text-[#0053b5]" /> แกลเลอรีภาพ ({galleryList.length} รูป):
                            </span>
                            {galleryList.length < 10 && (
                              <label className="cursor-pointer text-[10px] font-bold text-[#0053b5] hover:underline flex items-center gap-0.5">
                                <Plus className="w-3 h-3" /> เพิ่มรูป
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                      handleAddPhotosToExistingProject(proj.id, e.target.files);
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </div>

                          <div className="grid grid-cols-5 gap-1.5 pt-1">
                            {galleryList.map((photo: string, phIdx: number) => (
                              <div key={phIdx} className="aspect-square rounded-lg overflow-hidden relative border border-slate-200 group bg-slate-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={photo} alt="" className="w-full h-full object-cover" />
                                {phIdx === 0 ? (
                                  <div className="absolute inset-0 border-2 border-[#0053b5] pointer-events-none" />
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSetExistingProjectCover(proj.id, phIdx)}
                                    className="absolute inset-0 bg-black/60 text-white text-[8px] font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center p-0.5 text-center leading-tight transition-opacity"
                                    title="ตั้งเป็นหน้าปก"
                                  >
                                    ตั้งหน้าปก
                                  </button>
                                )}
                                {galleryList.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveExistingProjectPhoto(proj.id, phIdx)}
                                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="ลบรูป"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Title & Location inputs */}
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const updated = [...data.projects];
                              updated[pIdx].title = e.target.value;
                              setData({ ...data, projects: updated });
                            }}
                            className="w-full px-2.5 py-1 border border-slate-200 rounded-lg font-bold text-[#0f172a] text-xs"
                            placeholder="ชื่อโครงการ"
                          />
                          <input
                            type="text"
                            value={proj.location}
                            onChange={(e) => {
                              const updated = [...data.projects];
                              updated[pIdx].location = e.target.value;
                              setData({ ...data, projects: updated });
                            }}
                            className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] text-slate-500"
                            placeholder="ทำเล/ที่ตั้ง"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: CORPORATE GUARANTEES */}
        {/* ========================================================= */}
        {activeTab === 'guarantees' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
            <h3 className="font-bold text-base text-[#0f172a] border-b border-slate-100 pb-2">แก้ไขมาตรฐานความมั่นใจระดับองค์กร (4 เสาหลัก)</h3>
            <p className="text-slate-500">ปรับแก้ข้อความการันตีความปลอดภัยและมาตรฐานที่สร้างความไว้วางใจให้นิติบุคคล</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {data.guarantees?.map((guar: any, gIdx: number) => (
                <div key={gIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0f172a] text-white font-bold flex items-center justify-center text-xs">{gIdx + 1}</span>
                    <input
                      type="text"
                      placeholder="หัวข้อย่อยอังกฤษ..."
                      value={guar.subtitle}
                      onChange={(e) => {
                        const updated = [...data.guarantees];
                        updated[gIdx].subtitle = e.target.value;
                        setData({ ...data, guarantees: updated });
                      }}
                      className="px-2 py-1 border border-slate-200 rounded text-[11px] text-[#0053b5] font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-semibold mb-0.5">หัวข้อหลัก</label>
                    <input
                      type="text"
                      value={guar.title}
                      onChange={(e) => {
                        const updated = [...data.guarantees];
                        updated[gIdx].title = e.target.value;
                        setData({ ...data, guarantees: updated });
                      }}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-bold text-[#0f172a] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-semibold mb-0.5">คำอธิบายรายละเอียด</label>
                    <textarea
                      rows={3}
                      value={guar.desc}
                      onChange={(e) => {
                        const updated = [...data.guarantees];
                        updated[gIdx].desc = e.target.value;
                        setData({ ...data, guarantees: updated });
                      }}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px] text-slate-600 leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: CLIENTS MARQUEE */}
        {/* ========================================================= */}
        {activeTab === 'clients' && (
          <div className="space-y-6 text-xs">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-base text-[#0f172a]">+ เพิ่มแบรนด์ผู้พัฒนา / โครงการในแถบเลื่อน</h3>
                <span className="text-[11px] font-bold text-[#0053b5] bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
                  ️ รองรับรูปภาพ / โลโก้
                </span>
              </div>
              <p className="text-slate-500 mb-4">ชื่อแบรนด์ รูปภาพ หรือโลโก้โครงการที่แสดงในแถบวิ่งวนลูปอัตโนมัติใต้ Hero Section</p>
              
              <form onSubmit={handleAddClient} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#0f172a] mb-1">ชื่อแบรนด์ *</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น Land & Houses, Noble Development"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#0f172a] mb-1">ชื่อโครงการ หรือบทบาท</label>
                    <input
                      type="text"
                      placeholder="เช่น เดอะ รูม สุขุมวิท 69 หรือ คอนโดมิเนียม"
                      value={newClient.role}
                      onChange={(e) => setNewClient({ ...newClient, role: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                {/* Client Photo Upload */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0 shadow-xs flex items-center justify-center">
                    {newClient.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={newClient.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5 w-full">
                    <label className="block font-semibold text-[#0f172a]">รูปภาพโครงการ / โลโก้แบรนด์</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="URL รูปภาพ เช่น /images/projects/photo.jpg"
                        value={newClient.image}
                        onChange={(e) => setNewClient({ ...newClient, image: e.target.value })}
                        className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                      />
                      <input
                        type="file"
                        ref={clientFileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleNewClientUpload}
                      />
                      <button
                        type="button"
                        onClick={() => clientFileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0053b5] rounded-lg font-medium shrink-0 flex items-center gap-1 transition-colors"
                      >
                        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>อัปโหลดรูป</span>
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#0f172a] hover:bg-[#0053b5] text-white rounded-xl font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span>เพิ่มลูกค้า</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Clients List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-base text-[#0f172a] flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#0053b5]" />
                    <span>รายชื่อแบรนด์ทั้งหมดในแถบเลื่อน ({data.clients?.length || 0})</span>
                  </h3>
                  <span className="text-slate-500 text-xs">ระบบจะแบ่งแสดงผลเป็น 2 แถววิ่งวนลูปอัตโนมัติบนหน้าแรก</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetDefaultClients}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0053b5] text-xs font-bold transition-all border border-slate-300 self-start sm:self-auto cursor-pointer shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>คืนค่า 20 แบรนด์ดังเริ่มต้น</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {data.clients?.map((cl: any, cIdx: number) => {
                  const clientInputId = `client-file-${cIdx}`;
                  return (
                    <div
                      key={cIdx}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-2.5 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {/* Thumbnail & Change Photo */}
                        <div className="relative group shrink-0">
                          <div className="w-20 h-12 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-xs flex items-center justify-center p-1.5">
                            {cl.image || cl.logo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={cl.image || cl.logo}
                                alt={cl.name}
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/GR.svg';
                                }}
                              />
                            ) : (
                              <Building2 className="w-6 h-6 text-slate-400" />
                            )}
                          </div>
                          <label
                            htmlFor={clientInputId}
                            className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white text-[10px] font-medium"
                            title="คลิกเพื่อเปลี่ยนรูป"
                          >
                            <Upload className="w-3.5 h-3.5" />
                          </label>
                          <input
                            id={clientInputId}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                const url = await uploadFile(e.target.files[0]);
                                if (url) {
                                  const updated = [...data.clients];
                                  updated[cIdx].image = url;
                                  setData({ ...data, clients: updated });
                                }
                              }
                            }}
                          />
                        </div>

                        {/* Text Inputs */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <input
                            type="text"
                            value={cl.name}
                            onChange={(e) => {
                              const updated = [...data.clients];
                              updated[cIdx].name = e.target.value;
                              setData({ ...data, clients: updated });
                            }}
                            className="w-full px-2 py-1 border border-slate-200 rounded-lg font-bold text-[#0f172a] text-xs bg-white focus:outline-none focus:border-[#0053b5]"
                            placeholder="ชื่อแบรนด์"
                          />
                          <input
                            type="text"
                            value={cl.role || ''}
                            onChange={(e) => {
                              const updated = [...data.clients];
                              updated[cIdx].role = e.target.value;
                              setData({ ...data, clients: updated });
                            }}
                            className="w-full px-2 py-0.5 border border-slate-200 rounded-md text-[10px] text-slate-600 bg-white focus:outline-none focus:border-[#0053b5]"
                            placeholder="ชื่อโครงการ / บทบาท"
                          />
                        </div>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteClient(cIdx)}
                          className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                          title="ลบลูกค้านี้"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Direct URL input for image */}
                      <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 text-[10px]">
                        <span className="text-slate-400 shrink-0">รูป:</span>
                        <input
                          type="text"
                          value={cl.image || cl.logo || ''}
                          onChange={(e) => {
                            const updated = [...data.clients];
                            updated[cIdx].image = e.target.value;
                            setData({ ...data, clients: updated });
                          }}
                          placeholder="URL รูปภาพ"
                          className="flex-1 px-1.5 py-0.5 border border-slate-100 rounded text-[10px] text-slate-500 bg-white/80 focus:bg-white focus:outline-none focus:border-slate-300"
                        />
                        <label
                          htmlFor={clientInputId}
                          className="cursor-pointer px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-[#0053b5] rounded text-[9px] font-medium shrink-0 transition-colors"
                        >
                          เปลี่ยนรูป
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 8: CSR ACTIVITIES (UP TO 10 PHOTOS) */}
        {/* ========================================================= */}
        {activeTab === 'csr' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-base text-[#0f172a]">+ เพิ่มกิจกรรมเพื่อสังคม (CSR) ใหม่</h3>
                <span className="text-[11px] font-bold text-[#0053b5] bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
                   ใส่รูปได้สูงสุด 10 รูป
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">อัปโหลดรูปภาพกิจกรรมจริงได้สูงสุด 10 รูป และกรอกรายละเอียด</p>

              <form onSubmit={handleAddCsr} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-[#0f172a] mb-1">ชื่อกิจกรรม *</label>
                  <input type="text" required placeholder="เช่น กิจกรรมปลูกป่าเพื่อชุมชน" value={newCsr.title} onChange={(e) => setNewCsr({ ...newCsr, title: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-medium text-[#0f172a] mb-1">วันที่จัดกิจกรรม *</label>
                  <input type="text" required placeholder="เช่น 20 สิงหาคม 2568" value={newCsr.date} onChange={(e) => setNewCsr({ ...newCsr, date: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-medium text-[#0f172a] mb-1">หมวดหมู่กิจกรรม</label>
                  <select value={newCsr.category} onChange={(e) => setNewCsr({ ...newCsr, category: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white">
                    <option value="การศึกษาและเยาวชน">การศึกษาและเยาวชน</option>
                    <option value="ช่วยเหลือสังคม">ช่วยเหลือสังคม</option>
                    <option value="พัฒนาคุณภาพชีวิต">พัฒนาคุณภาพชีวิต</option>
                    <option value="สิ่งแวดล้อมและชุมชน">สิ่งแวดล้อมและชุมชน</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#0f172a] mb-1">สถานที่จัดกิจกรรม</label>
                  <input type="text" placeholder="เช่น โรงเรียนวันเสาร์, นนทบุรี" value={newCsr.location} onChange={(e) => setNewCsr({ ...newCsr, location: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-medium text-[#0f172a] mb-1">รายละเอียดกิจกรรม</label>
                  <textarea rows={3} placeholder="คำบรรยายเรื่องราวกิจกรรม..." value={newCsr.desc} onChange={(e) => setNewCsr({ ...newCsr, desc: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl leading-relaxed" />
                </div>

                {/* CSR 10 Photos Upload Box */}
                <div className="sm:col-span-2 bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-[#0f172a] flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#0053b5]" />
                      <span>รูปภาพกิจกรรม CSR (ใส่ได้สูงสุด 10 รูป)</span>
                    </label>
                    <span className="text-[11px] font-bold text-[#0053b5] bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                      {newCsr.images.length} / 10 รูป
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {newCsr.images.map((imgUrl, imgIdx) => (
                      <div key={imgIdx} className="aspect-[4/3] rounded-xl overflow-hidden relative border-2 border-slate-200 group bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setNewCsr(prev => {
                              const filtered = prev.images.filter((_, i) => i !== imgIdx);
                              const safe = filtered.length > 0 ? filtered : ['/images/csr-donation-nokkhamin.jpg'];
                              return { ...prev, images: safe, image: safe[0] };
                            });
                          }}
                          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {newCsr.images.length < 10 && (
                    <div className="flex items-center gap-3 pt-1">
                      <input
                        type="file"
                        ref={csrFileInputRef}
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleNewCsrUpload(e.target.files);
                          }
                        }}
                      />
                      <button
                        type="button"
                        disabled={uploading}
                        onClick={() => csrFileInputRef.current?.click()}
                        className="px-4 py-2 bg-[#0053b5] hover:bg-[#004293] disabled:bg-slate-300 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-xs transition-all text-xs"
                      >
                        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>+ เพิ่มรูปภาพกิจกรรม (เลือกได้หลายรูป)</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2 flex justify-end">
                  <button type="submit" className="px-5 py-2.5 bg-[#0f172a] hover:bg-[#0053b5] text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-xs transition-colors">
                    <Plus className="w-3.5 h-3.5 text-white" />
                    <span>เพิ่มกิจกรรม CSR</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Existing CSR List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
              <h3 className="font-bold text-base text-[#0f172a] mb-4">รายการกิจกรรม CSR ในระบบ ({data.csr?.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
                {data.csr?.map((c: any, cIdx: number) => {
                  const galleryList: string[] = (c.gallery && c.gallery.length > 0) ? c.gallery : (c.images && c.images.length > 0 ? c.images : [c.image]);
                  return (
                    <div key={c.id} className="p-4 border border-slate-200 rounded-2xl flex flex-col justify-between bg-slate-50 hover:bg-white transition-all space-y-3 shadow-2xs">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] text-[#0053b5] font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-300">{c.category}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                               {galleryList.length}/10 รูป
                            </span>
                            <button onClick={() => handleDeleteCsr(c.id)} className="text-slate-400 hover:text-rose-600 p-1">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="aspect-[16/10] rounded-xl overflow-hidden mb-2.5 bg-slate-100 relative group border border-slate-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                        </div>

                        {/* Gallery strip */}
                        <div className="space-y-1 mb-3 bg-white p-2 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-slate-700">ภาพกิจกรรม ({galleryList.length} รูป):</span>
                            {galleryList.length < 10 && (
                              <label className="cursor-pointer text-[10px] font-bold text-[#0053b5] hover:underline flex items-center gap-0.5">
                                <Plus className="w-3 h-3" /> เพิ่มรูป
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                      handleAddPhotosToExistingCsr(c.id, e.target.files);
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </div>
                          <div className="grid grid-cols-5 gap-1.5 pt-1">
                            {galleryList.map((photo: string, phIdx: number) => (
                              <div key={phIdx} className="aspect-square rounded-lg overflow-hidden relative border border-slate-200 group bg-slate-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={photo} alt="" className="w-full h-full object-cover" />
                                {galleryList.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveExistingCsrPhoto(c.id, phIdx)}
                                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <input
                          type="text"
                          value={c.title}
                          onChange={(e) => {
                            const updated = [...data.csr];
                            updated[cIdx].title = e.target.value;
                            setData({ ...data, csr: updated });
                          }}
                          className="w-full px-2.5 py-1 border border-slate-200 rounded-lg font-bold text-[#0f172a] text-xs"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 9: ARTICLES (UP TO 10 PHOTOS) */}
        {/* ========================================================= */}
        {activeTab === 'articles' && (
          <div className="space-y-6 text-xs">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-base text-[#0f172a]">+ สร้างบทความสาระน่ารู้ใหม่</h3>
                <span className="text-[11px] font-bold text-[#0053b5] bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
                   ใส่รูปได้สูงสุด 10 รูป
                </span>
              </div>
              <p className="text-slate-500 mb-4">เพิ่มบทความพร้อมเนื้อหาฉบับเต็มและอัปโหลดรูปภาพประกอบได้สูงสุด 10 รูป</p>

              <form onSubmit={handleAddArticle} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-[#0f172a] mb-1">หัวข้อบทความ *</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น 5 เทคนิคดูแลสนามหญ้าในฤดูฝน..."
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#0f172a] mb-1">ชื่อผู้เขียน</label>
                  <input
                    type="text"
                    value={newArticle.author}
                    onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#0f172a] mb-1">วันที่เผยแพร่</label>
                  <input
                    type="text"
                    value={newArticle.date}
                    placeholder="เช่น 12 กันยายน 2568"
                    onChange={(e) => setNewArticle({ ...newArticle, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#0f172a] mb-1">เวลาอ่านโดยประมาณ</label>
                  <input
                    type="text"
                    value={newArticle.readTime}
                    placeholder="เช่น 4 นาที"
                    onChange={(e) => setNewArticle({ ...newArticle, readTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#0f172a] mb-1">แท็กหมวดหมู่ (คั่นด้วยจุลภาค)</label>
                  <input
                    type="text"
                    value={newArticle.tags}
                    placeholder="เช่น ดูแลสวน, สาระน่ารู้, สนามหญ้า"
                    onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                {/* Article 10 Photos Upload Box */}
                <div className="sm:col-span-2 bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-[#0f172a] flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#0053b5]" />
                      <span>รูปภาพประกอบบทความ (ใส่ได้สูงสุด 10 รูป รูปแรกจะเป็นภาพปก)</span>
                    </label>
                    <span className="text-[11px] font-bold text-[#0053b5] bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                      {newArticle.images.length} / 10 รูป
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      ref={articleFileInputRef}
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleNewArticleUpload(e.target.files);
                        }
                      }}
                    />
                    <button
                      type="button"
                      disabled={uploading || newArticle.images.length >= 10}
                      onClick={() => articleFileInputRef.current?.click()}
                      className="px-4 py-2 bg-[#0f172a] hover:bg-[#0053b5] text-white rounded-xl font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-white" />}
                      <span>+ เลือกรูปภาพจากเครื่อง (เลือกได้หลายรูป)</span>
                    </button>
                    <span className="text-[11px] text-slate-500">รองรับ PNG, JPG, WebP</span>
                  </div>

                  {/* Uploaded Thumbnails Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                    {newArticle.images.map((imgUrl, idx) => (
                      <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden relative border-2 border-slate-200 group bg-slate-100 shadow-2xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imgUrl} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                        
                        {/* Badge for Cover */}
                        {idx === 0 ? (
                          <div className="absolute top-1.5 left-1.5 bg-[#0f172a] text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-xs">
                            ภาพปก
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetNewArticleCover(idx)}
                            className="absolute bottom-1.5 left-1.5 bg-black/70 hover:bg-[#0053b5] text-white text-[9px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ตั้งเป็นภาพปก
                          </button>
                        )}

                        {/* Remove button */}
                        {newArticle.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveNewArticleImage(idx)}
                            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            title="ลบรูปนี้"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-[#0f172a] mb-1">คำบรรยายย่อ (Summary ที่แสดงบนการ์ด)</label>
                  <textarea
                    rows={2}
                    placeholder="สรุปเนื้อหาบทความแบบสั้น เพื่อดึงดูดผู้อ่าน..."
                    value={newArticle.summary}
                    onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-medium text-[#0f172a] mb-1">เนื้อหาบทความฉบับเต็ม (Full Content ในหน้าต่างอ่านต่อ)</label>
                  <textarea
                    rows={7}
                    placeholder="พิมพ์เนื้อหาฉบับเต็ม ย่อหน้า หรือรายการข้อ (เช่น 1. การเตรียมดิน... • ใส่ปุ๋ยหมัก...)..."
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl leading-relaxed"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0f172a] hover:bg-[#0053b5] text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span>เผยแพร่บทความ</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Articles List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
              <h3 className="font-bold text-base text-[#0f172a] mb-4">
                บทความทั้งหมดในระบบ ({data.articles?.length || 0})
              </h3>
              <div className="space-y-5 text-xs">
                {data.articles?.map((art: any, aIdx: number) => {
                  const artGal: string[] = (art.images && art.images.length > 0)
                    ? art.images
                    : (art.gallery && art.gallery.length > 0 ? art.gallery : [art.image]);
                  const artFileInputId = `art-file-input-${art.id}`;

                  return (
                    <div key={art.id} className="p-4 border border-slate-200 rounded-2xl bg-slate-50 space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#0f172a] text-sm">{art.title}</span>
                          <span className="text-[10px] font-bold text-[#0053b5] bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                             {artGal.length} รูป
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteArticle(art.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                          title="ลบบทความนี้"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Photo Gallery Manager for Existing Article */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-700 text-[11px] flex items-center gap-1">
                            <ImageIcon className="w-3.5 h-3.5 text-[#0053b5]" />
                            <span>รูปภาพของบทความนี้ ({artGal.length}/10 รูป)</span>
                          </span>
                          {artGal.length < 10 && (
                            <div>
                              <input
                                id={artFileInputId}
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    handleAddPhotosToExistingArticle(art.id, e.target.files);
                                  }
                                }}
                              />
                              <label
                                htmlFor={artFileInputId}
                                className="cursor-pointer text-[10px] font-bold text-[#0053b5] bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1 transition-colors"
                              >
                                <Upload className="w-3 h-3" />
                                <span>+ เพิ่มรูป</span>
                              </label>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {artGal.map((photo: string, phIdx: number) => (
                            <div key={phIdx} className="aspect-[4/3] rounded-lg overflow-hidden relative border border-slate-200 group bg-slate-100">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={photo} alt="" className="w-full h-full object-cover" />
                              {phIdx === 0 ? (
                                <span className="absolute top-1 left-1 bg-[#0f172a] text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                                  ภาพปก
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetExistingArticleCover(art.id, phIdx)}
                                  className="absolute bottom-1 left-1 bg-black/70 hover:bg-[#0053b5] text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  ตั้งเป็นปก
                                </button>
                              )}
                              {artGal.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveExistingArticlePhoto(art.id, phIdx)}
                                  className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="ลบรูปนี้"
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-400 font-semibold mb-0.5">หัวข้อบทความ</label>
                          <input
                            type="text"
                            value={art.title}
                            onChange={(e) => {
                              const updated = [...data.articles];
                              updated[aIdx].title = e.target.value;
                              setData({ ...data, articles: updated });
                            }}
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-bold bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 font-semibold mb-0.5">ผู้เขียน</label>
                          <input
                            type="text"
                            value={art.author}
                            onChange={(e) => {
                              const updated = [...data.articles];
                              updated[aIdx].author = e.target.value;
                              setData({ ...data, articles: updated });
                            }}
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-slate-400 font-semibold mb-0.5">คำบรรยายย่อ (Summary)</label>
                          <textarea
                            rows={2}
                            value={art.summary || ''}
                            onChange={(e) => {
                              const updated = [...data.articles];
                              updated[aIdx].summary = e.target.value;
                              setData({ ...data, articles: updated });
                            }}
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white leading-relaxed"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-slate-400 font-semibold mb-0.5">เนื้อหาบทความฉบับเต็ม (Full Content)</label>
                          <textarea
                            rows={4}
                            value={art.content || art.summary || ''}
                            onChange={(e) => {
                              const updated = [...data.articles];
                              updated[aIdx].content = e.target.value;
                              setData({ ...data, articles: updated });
                            }}
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg leading-relaxed bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 10: COMPANY SETTINGS & CONTACT */}
        {/* ========================================================= */}
        {activeTab === 'company' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
            <h3 className="font-bold text-base text-[#0f172a] border-b border-slate-100 pb-2">ข้อมูลบริษัทและช่องทางติดต่อ (Company Information)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-medium text-[#0f172a] mb-1">ชื่อแบรนด์บริษัท (Company Name)</label>
                <input
                  type="text"
                  value={data.company?.name || ''}
                  onChange={(e) => setData({ ...data, company: { ...data.company, name: e.target.value } })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-[#0f172a]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#0f172a] mb-1">สโลแกน (Slogan / Tagline)</label>
                <input
                  type="text"
                  value={data.company?.tagline || ''}
                  onChange={(e) => setData({ ...data, company: { ...data.company, tagline: e.target.value } })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-medium text-[#0f172a] mb-1">เบอร์โทรศัพท์ติดต่อ (Phone)</label>
                <input
                  type="text"
                  value={data.company?.phone || ''}
                  onChange={(e) => setData({ ...data, company: { ...data.company, phone: e.target.value } })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-[#0053b5]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#0f172a] mb-1">เบอร์ที่แสดงบนหน้าเว็บ (Phone Display)</label>
                <input
                  type="text"
                  value={data.company?.phoneDisplay || ''}
                  onChange={(e) => setData({ ...data, company: { ...data.company, phoneDisplay: e.target.value } })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-[#0053b5]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#0f172a] mb-1">LINE Official ID</label>
                <input
                  type="text"
                  value={data.company?.lineId || ''}
                  onChange={(e) => setData({ ...data, company: { ...data.company, lineId: e.target.value } })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-medium text-[#0f172a] mb-1">ลิงก์เพิ่มเพื่อน LINE (Direct URL / lin.ee)</label>
                <input
                  type="text"
                  placeholder="https://line.me/R/ti/p/@goldenriver"
                  value={data.company?.lineUrl || ''}
                  onChange={(e) => setData({ ...data, company: { ...data.company, lineUrl: e.target.value } })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-medium text-[#0f172a] mb-1">รูป QR Code LINE Official</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 p-1 border border-slate-200 rounded-lg bg-white shrink-0 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.company?.lineQrCode || '/images/line-qr-code.svg'} alt="" className="w-full h-full object-contain" />
                  </div>
                  <input
                    type="text"
                    value={data.company?.lineQrCode || ''}
                    onChange={(e) => setData({ ...data, company: { ...data.company, lineQrCode: e.target.value } })}
                    placeholder="/images/line-qr-code.svg"
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => lineQrFileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium shrink-0 flex items-center gap-1 border border-slate-300 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>อัปโหลด QR</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#0f172a] mb-1">อีเมลทางการ (Email)</label>
                <input
                  type="email"
                  value={data.company?.email || ''}
                  onChange={(e) => setData({ ...data, company: { ...data.company, email: e.target.value } })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-medium text-[#0f172a] mb-1">เวลาทำการ (Working Hours)</label>
                <input
                  type="text"
                  value={data.company?.workingHours || ''}
                  onChange={(e) => setData({ ...data, company: { ...data.company, workingHours: e.target.value } })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-medium text-[#0f172a] mb-1">เลขประจำตัวผู้เสียภาษี (Tax ID)</label>
                <input
                  type="text"
                  value={data.company?.taxId || ''}
                  onChange={(e) => setData({ ...data, company: { ...data.company, taxId: e.target.value } })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-medium text-[#0f172a] mb-1">ที่ตั้งสำนักงาน (Office Address)</label>
                <textarea
                  rows={2}
                  value={data.company?.address || ''}
                  onChange={(e) => setData({ ...data, company: { ...data.company, address: e.target.value } })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 11: DYNAMIC STORY BACKGROUND (4 SCENES) */}
        {/* ========================================================= */}
        {activeTab === 'background' && (
          <div className="space-y-6 text-xs">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-base text-[#0f172a] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#0053b5]" />
                  <span>จัดการภาพพื้นหลังเปลี่ยนฉากตามการเลื่อนหน้าจอ (Dynamic Story Scroll)</span>
                </h3>
                <span className="text-[11px] font-bold text-[#0053b5] bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
                  4 ฉากเรื่องราว
                </span>
              </div>
              <p className="text-slate-500 mb-6 leading-relaxed">
                ภาพพื้นหลังของเว็บไซต์ Golden River จะค่อยๆ เปลี่ยนฉากและขยับ Parallax อย่างนุ่มนวลตามระดับการเลื่อนหน้าจอของผู้ชม (Scroll Position) คุณสามารถเปลี่ยนรูปภาพและข้อความป้ายกำกับของแต่ละฉากได้ที่นี่
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {(data.backgroundScenes || [
                  { id: 'scene-1', name: 'ฉากที่ 1: ช่วงต้น (Hero & ดูแลสวน)', label: 'บริการดูแลสวน & พื้นที่สีเขียว', sub: 'Garden Care & Maintenance', image: '/images/garden.jpg' },
                  { id: 'scene-2', name: 'ฉากที่ 2: ช่วงบริการ (ตกแต่ง & ตัดแต่งภูมิทัศน์)', label: 'งานตกแต่ง & ตัดแต่งภูมิทัศน์', sub: 'Landscape Styling & Tree Pruning', image: '/images/garden-styling.jpg' },
                  { id: 'scene-3', name: 'ฉากที่ 3: ช่วงผลงานโครงการจริง', label: 'ผลงานโครงการจริงกว่า 30+ แห่ง', sub: 'Real Condominium & Residential Projects', image: '/images/projects/b38e2aab8d87f658c5aa4e584005f0ad.jpg' },
                  { id: 'scene-4', name: 'ฉากที่ 4: ช่วงกิจกรรมเพื่อสังคม (CSR)', label: 'กิจกรรมจริงเพื่อสังคมและเยาวชน', sub: 'Real CSR & Community Activities', image: '/images/csr-saturday-school-real.jpg' }
                ]).map((scene: any, sIdx: number) => {
                  const bgInputId = `bg-scene-file-${sIdx}`;
                  return (
                    <div
                      key={scene.id || sIdx}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between gap-4 hover:border-[#0053b5]/50 transition-colors"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#0f172a] text-xs">
                            {scene.name || `ฉากที่ ${sIdx + 1}`}
                          </span>
                          <span className="text-[10px] font-semibold text-[#0053b5] bg-white px-2 py-0.5 rounded-full border border-slate-200">
                            Scene {sIdx + 1}
                          </span>
                        </div>

                        {/* Image Preview & Upload Button */}
                        <div className="aspect-[16/9] rounded-xl overflow-hidden relative border border-slate-200 bg-slate-900 group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={scene.image}
                            alt={scene.label}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/garden.jpg';
                            }}
                          />
                          <label
                            htmlFor={bgInputId}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-xs font-semibold gap-1"
                          >
                            <Upload className="w-5 h-5 text-white" />
                            <span>คลิกเพื่ออัปโหลดเปลี่ยนภาพฉากนี้</span>
                          </label>
                          <input
                            id={bgInputId}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                const url = await uploadFile(e.target.files[0]);
                                if (url) {
                                  const currentScenes = [...(data.backgroundScenes || [])];
                                  if (!currentScenes[sIdx]) {
                                    currentScenes[sIdx] = { ...scene };
                                  }
                                  currentScenes[sIdx].image = url;
                                  setData({ ...data, backgroundScenes: currentScenes });
                                }
                              }
                            }}
                          />
                        </div>

                        {/* Image URL Input & Change Button */}
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className="text-slate-400 shrink-0">URL:</span>
                          <input
                            type="text"
                            value={scene.image}
                            onChange={(e) => {
                              const currentScenes = [...(data.backgroundScenes || [])];
                              if (!currentScenes[sIdx]) currentScenes[sIdx] = { ...scene };
                              currentScenes[sIdx].image = e.target.value;
                              setData({ ...data, backgroundScenes: currentScenes });
                            }}
                            className="flex-1 px-2 py-1 border border-slate-200 rounded-lg text-[10px] bg-white text-slate-600"
                            placeholder="URL รูปภาพ เช่น /images/garden.jpg"
                          />
                          <label
                            htmlFor={bgInputId}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#0053b5] rounded-lg font-semibold text-[10px] cursor-pointer shrink-0 transition-colors"
                          >
                            เลือกไฟล์
                          </label>
                        </div>

                        {/* Text labels */}
                        <div className="space-y-2 pt-1">
                          <div>
                            <label className="block text-[10px] text-slate-400 font-semibold mb-0.5">
                              ป้ายกำกับฉาก (ภาษาไทย)
                            </label>
                            <input
                              type="text"
                              value={scene.label || ''}
                              onChange={(e) => {
                                const currentScenes = [...(data.backgroundScenes || [])];
                                if (!currentScenes[sIdx]) currentScenes[sIdx] = { ...scene };
                                currentScenes[sIdx].label = e.target.value;
                                setData({ ...data, backgroundScenes: currentScenes });
                              }}
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white font-medium text-[#0f172a]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 font-semibold mb-0.5">
                              คำบรรยายรอง (ภาษาอังกฤษ)
                            </label>
                            <input
                              type="text"
                              value={scene.sub || ''}
                              onChange={(e) => {
                                const currentScenes = [...(data.backgroundScenes || [])];
                                if (!currentScenes[sIdx]) currentScenes[sIdx] = { ...scene };
                                currentScenes[sIdx].sub = e.target.value;
                                setData({ ...data, backgroundScenes: currentScenes });
                              }}
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-500 text-[11px]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

          </div>
        </main>
      </div>
    </div>
  );
}