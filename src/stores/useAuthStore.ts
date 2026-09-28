"use client";

import { create } from "zustand";

/** สมาชิก mock ของระบบ (พร้อมต่อ API จริงในอนาคต — โครงเดียวกับ Member ในหน้า profile) */
export type Member = {
  id: string;
  username: string;
  password: string; // mock เท่านั้น — ของจริงจะอยู่ฝั่ง server
  name: string;
  phone: string;
  email: string;
  idCard: string;
};

export const MOCK_MEMBER: Member = {
  id: "MB-0001",
  username: "สมชาย",
  password: "123456",
  name: "นายสมชาย มั่งคั่งกิจ",
  phone: "081-234-5678",
  email: "somchai@example.com",
  idCard: "1-1001-23456-78-9",
};

const SESSION_KEY = "deeggold-session";

type AuthState = {
  member: Member | null;
  /** เข้าสู่ระบบ — คืน null ถ้าสำเร็จ, คืนข้อความ error ถ้าไม่สำเร็จ */
  login: (username: string, password: string) => string | null;
  logout: () => void;
  /** restore session จาก localStorage (เรียกตอน mount ใน AuthGuard) */
  restore: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  member: null,

  login: (username, password) => {
    const u = username.trim();
    // รับได้ทั้งชื่อผู้ใช้ หรือเบอร์โทร (ตัดขีด/วงเล็บเทียบ)
    const phoneMatch = u.replace(/[-()\s]/g, "") === MOCK_MEMBER.phone.replace(/[-()\s]/g, "");
    if (!(u === MOCK_MEMBER.username || phoneMatch) || password !== MOCK_MEMBER.password) {
      return "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
    }
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(MOCK_MEMBER.id));
    } catch {
      /* sessionStorage ใช้ไม่ได้ — ยังล็อกอินได้ในหน้าเดียว */
    }
    set({ member: MOCK_MEMBER });
    return null;
  },

  logout: () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ข้าม */
    }
    set({ member: null });
  },

  restore: () => {
    if (useAuthStore.getState().member) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) set({ member: MOCK_MEMBER });
    } catch {
      /* ข้าม */
    }
  },
}));
