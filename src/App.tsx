import { useCallback, useEffect, useMemo, useState } from 'react'
import mikiJapanLogo from './assets/miki-japan-logo.jpg'
import {
  closeLiffWindow,
  getLineIdentity,
  isLiffLoginRedirectError,
} from './lib/liff'
import { syncRichMenu, type RichMenuSyncResult } from './services/authService'

type SyncState = 'syncing' | 'member' | 'register' | 'verify' | 'rejected' | 'error'

type SyncContent = {
  detail?: string
  eyebrow: string
  symbol: string
  title: string
  description: string
}

const getSyncState = (result: RichMenuSyncResult): SyncState => {
  if (result.richMenu === 'member' || result.status === 'approved') {
    return 'member'
  }
  if (result.richMenu === 'verify' || result.status === 'pending') {
    return 'verify'
  }
  if (result.richMenu === 'rejected' || result.status === 'rejected') {
    return 'rejected'
  }
  if (result.richMenu === 'register' || result.status === 'register') {
    return 'register'
  }

  return 'register'
}

const getContent = (state: SyncState): SyncContent => {
  switch (state) {
    case 'member':
      return {
        detail: 'กลับไปที่หน้าแชทเพื่อใช้งานเมนูสมาชิก',
        eyebrow: 'อัปเดตเรียบร้อย',
        symbol: '✓',
        title: 'เมนูสมาชิกพร้อมใช้งานแล้ว',
        description: 'ระบบตรวจพบข้อมูลสมาชิกของคุณและอัปเดตเมนูให้เป็น Member แล้ว',
      }
    case 'verify':
      return {
        detail: 'ร้านจะตรวจสอบข้อมูลและอัปเดตสถานะให้อัตโนมัติ',
        eyebrow: 'รอตรวจสอบ',
        symbol: '✓',
        title: 'เมนูรอตรวจสอบพร้อมใช้งานแล้ว',
        description: 'ระบบพบข้อมูลการสมัครที่อยู่ระหว่างตรวจสอบจากร้าน',
      }
    case 'rejected':
      return {
        detail: 'หากต้องการสอบถามเพิ่มเติม กรุณาติดต่อร้านผ่านแชท LINE',
        eyebrow: 'ตรวจสอบแล้ว',
        symbol: '!',
        title: 'อัปเดตเมนูแจ้งผลเรียบร้อยแล้ว',
        description: 'ระบบพบว่าข้อมูลของคุณไม่ผ่านเกณฑ์ที่ร้านกำหนด',
      }
    case 'register':
      return {
        detail: 'หากต้องการสมัครสมาชิก สามารถกดเมนูลงทะเบียนได้เลย',
        eyebrow: 'พร้อมสมัคร',
        symbol: '✓',
        title: 'เมนูสมัครสมาชิกพร้อมใช้งานแล้ว',
        description: 'ระบบยังไม่พบข้อมูลสมาชิกหรือข้อมูลการสมัครของบัญชี LINE นี้',
      }
    case 'error':
      return {
        detail: 'กรุณาปิดหน้านี้แล้วเปิดจาก LINE อีกครั้ง',
        eyebrow: 'ยังอัปเดตไม่ได้',
        symbol: '!',
        title: 'อัปเดตเมนูไม่สำเร็จ',
        description: 'ระบบยังไม่สามารถตรวจสอบบัญชี LINE ของคุณได้ในขณะนี้',
      }
    default:
      return {
        eyebrow: 'กำลังดำเนินการ',
        symbol: '…',
        title: 'กำลังอัปเดตเมนูของคุณ',
        description: 'กรุณารอสักครู่ ระบบกำลังตรวจสอบสถานะสมาชิกจากร้าน',
      }
  }
}

function App() {
  const [syncState, setSyncState] = useState<SyncState>('syncing')

  const syncMenu = useCallback(async () => {
    try {
      const lineIdentity = await getLineIdentity()
      const result = await syncRichMenu(lineIdentity)
      setSyncState(getSyncState(result))
    } catch (error) {
      if (isLiffLoginRedirectError(error)) {
        return
      }

      setSyncState('error')
    }
  }, [])

  useEffect(() => {
    void Promise.resolve().then(syncMenu)
  }, [syncMenu])

  useEffect(() => {
    if (syncState === 'syncing' || syncState === 'error') {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      void closeLiffWindow()
    }, 3000)

    return () => window.clearTimeout(timeoutId)
  }, [syncState])

  const content = useMemo(() => getContent(syncState), [syncState])
  const isError = syncState === 'error' || syncState === 'rejected'

  return (
    <main className="min-h-dvh bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
        <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 pb-3 pt-[calc(env(safe-area-inset-top)+14px)]">
          <div className="flex items-center gap-3">
            <img
              alt="Miki Japan"
              className="size-10 shrink-0 rounded-full border border-[var(--color-border)] object-cover shadow-sm"
              height="40"
              src={mikiJapanLogo}
              width="40"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--color-muted)]">
                Miki Japan
              </p>
              <h1 className="truncate text-lg font-semibold text-[var(--color-text)]">
                อัปเดตเมนู
              </h1>
            </div>
          </div>
        </header>

        <section className="flex flex-1 items-center px-4 py-8">
          <div className="w-full rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-8 text-center shadow-sm">
            <div
              className={[
                'mx-auto grid size-20 place-items-center rounded-full text-4xl font-semibold text-white shadow-sm',
                isError ? 'bg-[var(--color-error)]' : 'bg-[var(--color-primary)]',
              ].join(' ')}
              aria-hidden="true"
            >
              {content.symbol}
            </div>

            {syncState === 'syncing' ? (
              <div className="mx-auto mt-6 h-3 max-w-48 overflow-hidden rounded-full bg-[color:var(--color-primary)]/15">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-[var(--color-primary)]" />
              </div>
            ) : null}

            <p className="mt-6 text-sm font-semibold text-[var(--color-muted)]">
              {content.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-snug text-[var(--color-text)]">
              {content.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--color-muted)]">
              {content.description}
            </p>
            {content.detail ? (
              <p className="mt-5 rounded-2xl bg-[var(--color-surface-strong)] px-4 py-3 text-sm font-semibold leading-6 text-[var(--color-primary-dark)]">
                {content.detail}
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
