'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Claims = { sub: string; email?: string; [key: string]: unknown }

export default function AccountForm({ claims }: { claims: Claims | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const getProfile = useCallback(async () => {
    try {
      if (!claims?.sub) {
        setLoading(false)
        return
      }
      setLoading(true)
      const { data, error: fetchError, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website`)
        .eq('id', claims.sub)
        .single()

      if (fetchError && status !== 406) {
        console.log(fetchError)
        throw fetchError
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '프로필 로드 중 오류가 발생했습니다.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [claims, supabase])

  useEffect(() => {
    getProfile()
  }, [claims, getProfile])

  async function updateProfile({
    username: updatedUsername,
    fullname: updatedFullname,
    website: updatedWebsite,
  }: {
    username: string | null
    fullname: string | null
    website: string | null
  }) {
    try {
      if (!claims?.sub) {
        setError('로그인이 필요합니다.')
        return
      }
      setLoading(true)
      setError(null)
      setSuccess(false)

      const { error: updateError } = await supabase.from('profiles').upsert({
        id: claims.sub,
        full_name: updatedFullname,
        username: updatedUsername,
        website: updatedWebsite,
        updated_at: new Date().toISOString(),
      })
      if (updateError) throw updateError
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '프로필 업데이트 중 오류가 발생했습니다.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">프로필 설정</h1>
        <p className="text-muted-foreground mt-1">프로필 정보를 확인하고 수정할 수 있습니다.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>계정 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 이메일 (읽기 전용) */}
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={claims?.email ?? ''}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              이메일은 Supabase 계정 설정에서 변경할 수 있습니다.
            </p>
          </div>

          {/* 사용자명 */}
          <div className="space-y-2">
            <Label htmlFor="username">사용자명</Label>
            <Input
              id="username"
              type="text"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="my_username"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              영문, 숫자, 언더스코어(_)만 사용 가능 (최소 3자)
            </p>
          </div>

          {/* 이름 */}
          <div className="space-y-2">
            <Label htmlFor="fullname">이름</Label>
            <Input
              id="fullname"
              type="text"
              value={fullname || ''}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="홍길동"
              disabled={loading}
            />
          </div>

          {/* 웹사이트 */}
          <div className="space-y-2">
            <Label htmlFor="website">웹사이트</Label>
            <Input
              id="website"
              type="url"
              value={website || ''}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              disabled={loading}
            />
          </div>

          {/* 에러 메시지 */}
          {error && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{error}</div>}

          {/* 성공 메시지 */}
          {success && (
            <div className="p-3 rounded-md bg-green-100 text-green-800 text-sm">
              프로필이 저장되었습니다.
            </div>
          )}

          {/* 저장 버튼 */}
          <Button
            onClick={() =>
              updateProfile({
                username,
                fullname,
                website,
              })
            }
            disabled={loading || !claims?.sub}
            className="w-full"
          >
            {loading ? '저장 중...' : '저장'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
