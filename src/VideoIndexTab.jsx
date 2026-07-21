import { C } from "./reportUtils.js"

const STATUS_COLORS = {
  published: C.green, archived: C.archived, purged: C.purged, draft: C.draft,
}

function StatusBadge({ status }) {
  const s = String(status || '').toLowerCase()
  const color = STATUS_COLORS[s] || C.muted
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
      color: '#fff', background: color, textTransform: 'capitalize', whiteSpace: 'nowrap',
    }}>
      {status || '—'}
    </span>
  )
}

export default function VideoIndexTab({
  rows, loading, error,
  handleDownload, dlLoading,
}) {
  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: C.muted }}>Loading video index…</div>
  }
  if (error) {
    return (
      <div style={{ padding: 14, color: '#C0392B', background: '#FFF0EE', borderRadius: 8, fontSize: 13 }}>
        ⚠ {error}
      </div>
    )
  }
  if (!rows || rows.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: C.muted, fontSize: 13 }}>
        No video index data yet — select months and generate a report.
      </div>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: C.muted }}>{rows.length} item{rows.length === 1 ? '' : 's'}</div>
        <button onClick={handleDownload} disabled={dlLoading}
          style={{ padding: '7px 16px', borderRadius: 7, border: `1px solid ${C.blue}`, background: '#EEF4FF', color: C.blue, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          {dlLoading ? '⏳' : '⬇'} Download Excel
        </button>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: 10, border: `1px solid ${C.border}`, background: C.card }}>
        <table style={{ borderCollapse: 'collapse', fontSize: 12, minWidth: 'max-content', width: '100%' }}>
          <thead>
            <tr style={{ background: C.navy }}>
              {['Title', 'Content Key', 'CP Name', 'Content Type', 'VOD CMS Status', 'Metadata Status', 'Call Sign', 'Resolution', 'Duration', 'Video Dropped', 'Metadata Dropped'].map(h => (
                <th key={h} style={{ padding: '9px 12px', color: '#fff', fontWeight: 700, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.content_key || i} style={{ background: i % 2 === 0 ? '#F8FAFF' : '#fff', borderBottom: `1px solid ${C.border}` }}>
                {/* Hover shows the underlying video + metadata file names — often
                    long enough that showing them inline would blow out the column,
                    so they're tucked behind a native title tooltip instead. */}
                <td
                  style={{ padding: '8px 12px', fontWeight: 600, color: C.navy, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'help' }}
                  title={`Video file: ${r.video_file_name || '—'}\nMetadata file: ${r.metadata_filename || '—'}`}
                >
                  {r.content_title || '—'}
                </td>
                <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 11, color: C.muted }}>{r.content_key}</td>
                <td style={{ padding: '8px 12px' }}>{r.cp_name || '—'}</td>
                <td style={{ padding: '8px 12px' }}>{r.content_type || '—'}</td>
                {/* Hover shows the raw encode-index status underneath the
                    displayed Couchbase-derived vod_cms_status — these can
                    legitimately differ and it's useful to see both. */}
                <td style={{ padding: '8px 12px', cursor: 'help' }} title={`Encode-index status: ${r.status || '—'}`}>
                  <StatusBadge status={r.vod_cms_status} />
                </td>
                <td style={{ padding: '8px 12px' }}>{r.metadata_status || '—'}</td>
                <td style={{ padding: '8px 12px' }}>{r.ch_cs || '—'}</td>
                <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>{r.resolution || '—'}</td>
                {/* duration_hours is computed backend-side directly from this
                    same query's own duration column -- not a separate fetch,
                    so it's always in sync with the row it's displayed on. */}
                <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }} title={r.duration ? `${r.duration}s` : undefined}>
                  {r.duration_hours != null ? `${r.duration_hours}h` : '—'}
                </td>
                <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>{r.video_dropped_date || '—'}</td>
                <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>{r.metadata_dropped_date || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
