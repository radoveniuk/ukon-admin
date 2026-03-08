import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BiAlignLeft, BiExitFullscreen, BiFullscreen, BiUpload } from 'react-icons/bi';
import { BsClipboard, BsClipboardCheck } from 'react-icons/bs';
import Image from 'next/image';
import { Post } from '@prisma/client';
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import isEmpty from 'lodash.isempty';
import Dialog from 'rc-dialog';

import FileInput from 'components/FileInput';
import MonacoEditor from 'components/MonacoEditor';
import PostPreview from 'components/PostPreview/PostPreview';
import { Select } from 'components/Select';

//import WysiwygEditor from 'components/WysiwygEditor';
import copyToClipboard from 'helpers/clipboard';
import { getToday } from 'helpers/datetime';
import { sendFile } from 'helpers/files';

import styles from './PostForm.module.scss';

const LANGS = ['sk', 'uk', 'ru', 'en', 'de', 'hu', 'es', 'pl', 'ro', 'fr', 'hr', 'sr', 'bg', 'it'];

type Props = {
  data?: Post;
  onSubmit(data: Post): void;
  onDelete?(data: Post): void;
};

export default function PostForm ({ data, onSubmit, onDelete }: Props) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<Post>({
    defaultValues: data,
    mode: 'onChange',
  });
  const metaNameValue = watch('metaName') || '';
  const metaDescriptionValue = watch('metaDescription') || '';
  const selectedLang = watch('lang');
  const slugUrlValue = watch('slugUrl') || '';

  const [isUniqueCanonical, setIsUniqueCanonical] = useState(true);

  useEffect(() => {
    if (selectedLang) {
      setValue('metaHreflang', selectedLang, { shouldValidate: true });
    }
  }, [selectedLang, setValue]);

  // Canonical URL gen
  useEffect(() => {
    if (isUniqueCanonical) {
      const currentHost = window.location.host;
      const baseHost = currentHost.replace(/^admin\./, '');
      const protocol = window.location.protocol;

      const langSegment = selectedLang ? `/${selectedLang}` : '';
      const sectionSegment = '/blog';
      const slugSegment = slugUrlValue ? `/${slugUrlValue.replace(/^\//, '')}` : '';

      const generatedUrl = `${protocol}//${baseHost}${langSegment}${sectionSegment}${slugSegment}`;
      setValue('canonicalUrl', generatedUrl, { shouldValidate: true });
    }
  }, [isUniqueCanonical, selectedLang, slugUrlValue, setValue]);

  // Editor
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWordWrap, setIsWordWrap] = useState(true);
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  // Tags
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [isFetchingTags, setIsFetchingTags] = useState(false);
  const [showTagsSection, setShowTagsSection] = useState(false);
  useEffect(() => {
    setShowTagsSection(false);
  }, [selectedLang]);
  const handleFetchTags = async () => {
    if (!selectedLang) return;
    if (showTagsSection) {
      setShowTagsSection(false);
      return;
    }
    setIsFetchingTags(true);
    try {
      const res = await fetch('/_next/data/development/blog.json');
      if (!res.ok) {
        throw new Error('Chyba pri sťahovaní dát');
      }
      const data = await res.json();
      const posts = data?.pageProps?.posts || [];
      const tagsForCurrentLang = posts
        .filter((post: any) => post.lang === selectedLang)
        .flatMap((post: any) => post.tags || [])
        .filter(Boolean);
      const uniqueTags = Array.from(new Set(tagsForCurrentLang)) as string[];
      setExistingTags(uniqueTags);
      setShowTagsSection(true);
    } catch (error) {
      console.error('Chyba pri načítaní značiek:', error);
      setExistingTags([]);
    } finally {
      setIsFetchingTags(false);
    }
  };

  // Sidebar
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isDragging, setIsDragging] = useState(false);
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newWidth = window.innerWidth - e.clientX - 30;

      if (newWidth > 150 && newWidth < 600) {
        setSidebarWidth(newWidth);
      }
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'auto';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'auto';
    };
  }, [isDragging]);
  const htmlSnippets = [
    { label: '<h2>', code: '<h2></h2>' },
    { label: '<h3>', code: '<h3></h3>' },
    { label: '<p>', code: '<p></p>' },
    { label: '<i>', code: '<i></i>' },
    { label: '<b>', code: '<b></b>' },
    { label: '<a>', code: '<a href="#" target="_blank"></a>' },
    { label: '<ul>', code: '<p style="margin-bottom: 5px;"></p>\n<ul style="margin-top: 7px;">\n  <li></li>\n</ul>' },
    { label: '<table>', code: '<div class="responsive-table-container">\n  <table border="1" cellpadding="6" cellspacing="0">\n    <tbody>\n      <tr>\n        <td></td>\n        <td></td>\n      </tr>\n      <tr>\n        <td></td>\n        <td></td>\n      </tr>\n    </tbody>\n  </table>\n</div>' },
    { label: '<samp> €', code: '<samp></samp>' },
    { label: 'Services', code: '<div class="blog-services"></div>' },
  ];

  const [activeTab, setActiveTab] = useState<'html' | 'text' | 'preview'>('html');

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (updateState: EditorState) => {
    setEditorState(updateState);
    setValue('content', draftToHtml(convertToRaw(updateState.getCurrentContent())));
  };

  const submitHandler: SubmitHandler<Post> = (data) => {
    onSubmit({ ...data, tags: data.tags.map((tag) => tag.trim()).filter((tag) => !!tag) });
  };

  const [allowRender, setAllowRender] = useState(false);
  useEffect(() => {
    setAllowRender(true);
  }, []);

  useEffect(() => {
    if (data) {
      setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(data.content).contentBlocks)));
    }
  }, [data]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  // uplod medias
  const [openUploadMediaDialog, setOpenUploadMediaDialog] = useState(false);
  const [urlToCopy, setUrlToCopy] = useState('');
  const [isUrlCopied, setIsUrlCopied] = useState(false);

  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
        <div className={styles.controls}>
          <button
            type="submit"
            className={styles.submitBtn}
            style={{
              opacity: isValid ? 1 : 0.6,
              cursor: isValid ? 'pointer' : 'default',
            }}
          >
            Uložiť
          </button>
          {!!data?.id && (
            <button type="button" className={styles.deleteBtn} onClick={() => void setOpenDeleteDialog(true)}>
              Vymazať
            </button>
          )}
        </div>
        <div className={styles.dataSections}>
          <div className={styles.data}>
            <h3 className={styles.title}>Hlavička</h3>
            <div className={styles.fields}>
              <div className={styles.col}>
                <label>
                  <span>Názov článku *</span>
                  <input
                    type="text"
                    {...register('name', { required: true })}
                    style={{ borderColor: errors.name ? '#ef4444' : '' }}
                  />
                </label>
                <label>
                  <span>Dátum publikácie *</span>
                  <input type="text" {...register('publicationDate', { required: true, value: getToday() })} />
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px' }}>
                  <Controller
                    control={control}
                    name="lang"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <label>
                        <span>Jazyk *</span>
                        <div className={styles.selectWrapper} style={{ border: errors.lang ? '1px solid #ef4444' : '1px solid #e2e8f0', borderRadius: '8px', width: '100%', backgroundColor: '#f8fafb' }}>
                          <Select
                            options={LANGS.map((lg) => ({
                              value: lg,
                              text: lg.toUpperCase(),
                            }))}
                            onChange={({ value }) => field.onChange(value)}
                            value={field.value}
                          />
                        </div>
                      </label>
                    )}
                  />
                  <label>
                    <span>Hreflang (uk/ru/en/de/hu/es/pl/ro/fr/hr/sr/bg/it) *</span>
                    <input
                      type="text"
                      readOnly
                      {...register('metaHreflang', { required: true })}
                      style={{
                        borderColor: errors.metaHreflang ? '#ef4444' : '',
                        backgroundColor: '#f3f3f3',
                        cursor: 'default',
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className={styles.col}>
                <Controller
                  control={control}
                  name="titleImgUrl"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <label>
                      <span>Obrázok (1400x872 px)*</span>
                      <FileInput accept="image/*" id={'titleImgUrl'} onChange={(e) => void sendFile(e.target.files?.[0]).then((filename) => void field.onChange(filename))}>
                        <a
                          title="Upload"
                          className={styles.uploadBtn}
                          style={{ border: errors.titleImgUrl ? '1px dashed #ef4444' : '', color: errors.titleImgUrl ? '#ef4444' : '' }}
                        >
                          <BiUpload size={20} />
                          Nahrať obrázok
                        </a>
                      </FileInput>
                      <div className={styles.imgWrapper}>
                        {field.value && <Image layout="fill" objectFit="cover" src={`/api/files?id=${field.value}`} alt="image" />}
                      </div>
                    </label>
                  )}
                />
              </div>
            </div>
          </div>
          <div className={styles.data}>
            <h3 className={styles.title}>SEO data</h3>
            <div className={styles.fields}>
              <div className={styles.col}>
                <label>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                    <span>Meta name *</span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      textAlign: 'end',
                      color: metaNameValue.length > 60 ? '#ef4444' : '#64748b',
                    }}>
                      {metaNameValue.length} / 60
                    </span>
                  </div>
                  <input
                    type="text"
                    {...register('metaName', { required: true })}
                    style={{ borderColor: errors.metaName ? '#ef4444' : '' }}
                  />
                </label>
                <label>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                    <span>Meta description *</span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      textAlign: 'end',
                      color: metaDescriptionValue.length > 160 ? '#ef4444' : '#64748b',
                    }}>
                      {metaDescriptionValue.length} / 160
                    </span>
                  </div>
                  <textarea
                    {...register('metaDescription', { required: true })}
                    style={{ resize: 'none', borderColor: errors.metaDescription ? '#ef4444' : '' }}
                  />
                </label>
                <label>
                  <span>Meta keywords (živnosť, zivnost) *</span>
                  <input
                    type="text"
                    {...register('metaKeywords', { required: true })}
                    style={{ borderColor: errors.metaKeywords ? '#ef4444' : '' }}
                  />
                </label>
              </div>
              <div className={styles.col}>
                <label>
                  <span>Canonical URL *</span>
                  <div style={{ justifyContent: 'space-between', alignItems: 'center', width: '100%', display: 'grid', gap: '10px', gridTemplateColumns: '8fr 1fr' }}>
                    <div>
                      <input
                        type="text"
                        readOnly={isUniqueCanonical}
                        {...register('canonicalUrl', {
                          required: true,
                          pattern: !isUniqueCanonical ? {
                            value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                            message: 'Neplatný URL formát',
                          } : undefined,
                        })}
                        style={{
                          borderColor: errors.canonicalUrl ? '#ef4444' : '',
                          backgroundColor: isUniqueCanonical ? '#f3f3f3' : '#ffffff',
                          color: isUniqueCanonical ? '#1e293b' : '#1e293b',
                          cursor: isUniqueCanonical ? 'default' : 'text',
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsUniqueCanonical(!isUniqueCanonical)}
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '8px',
                        backgroundColor: isUniqueCanonical ? '#44998a' : '#f3f3f3',
                        color: isUniqueCanonical ? '#ffffff' : '#64748b',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        height: '48px',
                      }}
                    >
                      {isUniqueCanonical ? '✓ Unikátna' : 'Vlastná URL'}
                    </button>
                  </div>
                  {errors.canonicalUrl && (
                    <span style={{ color: '#ef4444', fontSize: '11px' }}>
                      {errors.canonicalUrl.message || ''}
                    </span>
                  )}
                </label>
                <label>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>Slug URL (.../slug) *</span>
                  </div>
                  <input
                    type="text"
                    {...register('slugUrl', {
                      required: 'Toto pole je povinné',
                      pattern: {
                        value: /^[a-z0-9-]+$/,
                        message: 'Povolené sú len malé písmená, čísla a pomlčka',
                      },
                    })}
                    style={{ borderColor: errors.slugUrl ? '#ef4444' : '' }}
                  />
                  {errors.slugUrl && (
                    <span style={{ color: '#ef4444', fontSize: '11px' }}>
                      {errors.slugUrl.message as string}
                    </span>
                  )}

                </label>
                {/* Tags */}
                <label>
                  <span style={{ marginBottom: '6px', display: 'block' }}>Tags</span>
                  <Controller
                    control={control}
                    name="tags"
                    defaultValue={[]}
                    render={({ field }) => (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                        <div style={{ justifyContent: 'space-between', alignItems: 'center', width: '100%', display: 'grid', gap: '10px', gridTemplateColumns: '8fr 1fr' }}>
                          <textarea
                            style={{
                              resize: 'none',
                              flex: 1,
                              minHeight: '75px',
                            }}
                            value={field.value.join('\n')}
                            onChange={(e) => {
                              const tags = e.target.value.split('\n');
                              field.onChange(tags);
                            }}
                          />
                          <button
                            type="button"
                            disabled={!selectedLang || isFetchingTags}
                            onClick={handleFetchTags}
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '8px 12px',
                              borderRadius: '6px',
                              backgroundColor: !selectedLang ? '#f3f3f3' : (showTagsSection ? '#e2e8f0' : '#99c3bd'),
                              color: !selectedLang ? '#94a3b8' : (showTagsSection ? '#475569' : '#1e293b'),
                              border: 'none',
                              cursor: !selectedLang ? 'default' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.2s ease',
                              whiteSpace: 'nowrap',
                              minHeight: '75px',
                            }}
                          >
                            {isFetchingTags ? (
                              <AiOutlineLoading3Quarters size={12} style={{ animation: 'spin 1s linear infinite' }} />
                            ) : null}
                            {showTagsSection ? 'Skryť značky' : 'Zobraziť značky'}
                          </button>
                        </div>
                        {showTagsSection && (
                          <div style={{
                            padding: '12px',
                            backgroundColor: '#f8fafb',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            animation: 'fadeIn 0.3s ease',
                            width: '100%',
                            boxSizing: 'border-box',
                          }}>
                            <span style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px', display: 'block' }}>Kliknutím pridáte/odoberiete značku:</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {existingTags.length === 0 ? (
                                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Žiadne značky pre jazyk {selectedLang?.toUpperCase()}</span>
                              ) : (
                                existingTags.map(tag => {
                                  const isSelected = field.value.map(t => t.trim()).includes(tag);
                                  return (
                                    <button
                                      key={tag}
                                      type="button"
                                      onClick={() => {
                                        let newTags = [...field.value.map(t => t.trim()).filter(Boolean)];
                                        if (isSelected) {
                                          newTags = newTags.filter(t => t !== tag);
                                        } else {
                                          newTags.push(tag);
                                        }
                                        field.onChange(newTags);
                                      }}
                                      style={{
                                        padding: '4px 10px',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        backgroundColor: isSelected ? '#44998A' : '#ffffff',
                                        color: isSelected ? '#ffffff' : '#475569',
                                        border: isSelected ? '1px solid #44998A' : '1px solid #cbd5e1',
                                        borderRadius: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                      }}
                                    >
                                      {tag} {isSelected && '✓'}
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className={styles.contentTabs}>
            <h3 className={styles.title} style={{ margin: 0 }}>Obsah</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a className={styles.uploadBtn} onClick={() => void setOpenUploadMediaDialog(true)}>
                  <BiUpload size={20} />
                  Nahrát a získat URL média
                </a>
                <button
                  type="button"
                  className={styles.uploadBtn}
                  style={{ border: '1px solid #cbd5e1' }}
                  onClick={() => setIsWordWrap(!isWordWrap)}
                >
                  <BiAlignLeft size={16} />
                  {isWordWrap ? 'Zalomenie: ZAP' : 'Zalomenie: VYP'}
                </button>
                <button
                  type="button"
                  className={styles.uploadBtn}
                  style={{ border: '1px solid #cbd5e1' }}
                  onClick={() => setIsFullscreen(true)}
                >
                  <BiFullscreen size={20} />
                  Na celú obrazovku
                </button>
              </div>
            </div>
            {allowRender && (
              <div className={styles.content} style={{ position: 'relative', height: '570px' }}>
                <div
                  className={`${styles.panel} ${activeTab === 'html' ? styles.active : ''}`}
                  style={isFullscreen ? {
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    width: '100vw', height: '100vh',
                    zIndex: 1000,
                    backgroundColor: '#1e1e1e',
                    display: 'flex', flexDirection: 'column',
                  } : {
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  {isFullscreen && (
                    <div style={{
                      padding: '10px 20px',
                      backgroundColor: '#252526',
                      borderBottom: '1px solid #333',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <span style={{ color: '#ccc', fontSize: '13px', fontWeight: 600 }}>HTML Editor</span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <a
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              padding: '6px 12px', borderRadius: '4px',
                              border: 'none', backgroundColor: '#d0d0d0', color: '#1e293b',
                              cursor: 'pointer', fontWeight: 600, fontSize: '12px',
                              transition: 'background 0.2s',
                              textDecoration: 'none',
                            }}
                            onClick={() => void setOpenUploadMediaDialog(true)}>
                            <BiUpload size={20} />Nahrát a získat URL média
                          </a>
                          <button
                            type="button"
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              padding: '6px 12px', borderRadius: '4px',
                              border: 'none', backgroundColor: '#d0d0d0', color: '#1e293b',
                              cursor: 'pointer', fontWeight: 600, fontSize: '12px',
                              transition: 'background 0.2s',
                            }}
                            onClick={() => setIsWordWrap(!isWordWrap)}
                          >
                            <BiAlignLeft size={16} />
                            {isWordWrap ? 'Zalomenie: ZAP' : 'Zalomenie: VYP'}
                          </button>
                          <button
                            type="button"
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              padding: '6px 12px', borderRadius: '4px',
                              border: 'none', backgroundColor: '#d0d0d0', color: '#1e293b',
                              cursor: 'pointer', fontWeight: 600, fontSize: '12px',
                              transition: 'background 0.2s',
                            }}
                            onClick={() => setIsFullscreen(true)}
                          >
                            <BiFullscreen size={20} />Na celú obrazovku
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsFullscreen(false)}
                            style={{
                              marginLeft: '10px',
                              display: 'flex', alignItems: 'center', gap: '6px',
                              padding: '6px 12px', borderRadius: '4px',
                              border: 'none', backgroundColor: '#ef4444', color: '#ffffff',
                              cursor: 'pointer', fontWeight: 600, fontSize: '12px',
                              transition: 'background 0.2s',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                          >
                            <BiExitFullscreen size={16} />Zavrieť
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    height: isFullscreen ? 'calc(100vh - 50px)' : '570px',
                    overflow: 'hidden',
                    border: isFullscreen ? 'none' : '1px solid #e2e8f0',
                    borderRadius: isFullscreen ? '0' : '8px',
                  }}>
                    <div style={{ flex: 1, minWidth: '300px', height: '100%', position: 'relative' }}>
                      <Controller
                        control={control}
                        name="content"
                        render={({ field }) => (
                          <MonacoEditor
                            height="100%"
                            defaultLanguage="html"
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(value).contentBlocks)));
                            }}
                            theme="vs-dark"
                            options={{
                              wordWrap: isWordWrap ? 'on' : 'off',
                              formatOnPaste: true,
                              formatOnType: true,
                              autoClosingBrackets: 'always',
                              autoClosingQuotes: 'always',
                              minimap: { enabled: true },
                              scrollBeyondLastLine: false,
                              fontSize: 14,
                              lineHeight: 24,
                              renderLineHighlight: 'all',
                            }}
                          />
                        )}
                      />
                    </div>
                    <div
                      onMouseDown={handleMouseDown}
                      style={{
                        width: '4px',
                        height: '100%',
                        backgroundColor: isDragging ? '#0ea5e9' : (isFullscreen ? '#333' : '#e2e8f0'),
                        cursor: 'col-resize',
                        transition: 'background-color 0.2s',
                        zIndex: 10,
                      }}
                      className={styles.hideOnMobile}
                    />
                    <div style={{
                      width: `${sidebarWidth}px`,
                      flexBasis: `${sidebarWidth}px`,
                      flexShrink: 0,
                      minWidth: '200px',
                      maxWidth: '50%',
                      height: '100%',
                      backgroundColor: isFullscreen ? '#252526' : '#f8fafb',
                      borderLeft: isFullscreen ? 'none' : '1px solid #e2e8f0',
                      padding: '16px',
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      boxSizing: 'border-box',
                    }}>
                      {htmlSnippets.map((snippet, index) => (
                        <div
                          key={index}
                          style={{
                            backgroundColor: isFullscreen ? '#1e1e1e' : '#ffffff',
                            border: `1px solid ${isFullscreen ? '#333' : '#e2e8f0'}`,
                            borderRadius: '6px',
                            padding: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            flexShrink: 0,
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: 500, color: isFullscreen ? '#fff' : '#1e293b' }}>
                              {snippet.label}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                copyToClipboard(snippet.code);
                              }}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '4px',
                                padding: '4px 8px', borderRadius: '4px',
                                backgroundColor: isFullscreen ? '#333' : '#f1f5f9',
                                color: isFullscreen ? '#ccc' : '#475569',
                                border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 500,
                                transition: 'all 0.2s',
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = isFullscreen ? '#444' : '#e2e8f0'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = isFullscreen ? '#333' : '#f1f5f9'}
                            >
                              <BsClipboard size={16} />
                            </button>
                          </div>
                          {/*<pre style={{
                            margin: 0, padding: '8px',
                            backgroundColor: isFullscreen ? '#000' : '#f1f5f9',
                            borderRadius: '4px', fontSize: '11px',
                            color: isFullscreen ? '#9cdcfe' : '#334155',
                            overflowX: 'auto', whiteSpace: 'pre-wrap',
                          }}>
                            {snippet.code}
                          </pre>*/}
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
      <Dialog visible={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e293b' }}>
              Vymazať článok
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
              Zadajte heslo pre vymazanie článku <strong style={{ color: '#1e293b' }}>{data?.name || 'tento článok'}</strong>. Táto akcia je nenávratná.
            </p>
          </div>
          <input
            type="password"
            placeholder="Zadajte heslo..."
            value={inputValue}
            onChange={handleInputChange}
            autoFocus
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              color: '#1e293b',
              backgroundColor: '#f8fafb',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {inputValue === '2024' && (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setOpenDeleteDialog(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f3f3',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f3f3'}
              >
                Zrušiť
              </button>
              <button
                type="button"
                onClick={() => void onDelete(data)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
              >
                Vymazať
              </button>
            </div>
          )}
        </div>
      </Dialog>
      <Dialog
        visible={openUploadMediaDialog}
        onClose={() => {
          setOpenUploadMediaDialog(false);
          setIsUrlCopied(false);
        }}
      >
        <div className={styles.copyDialogWrapper}>
          <FileInput
            accept="image/*"
            id="ImagesUploading"
            onChange={(e) => void sendFile(e.target.files?.[0]).then((filename) => { setUrlToCopy(`https://ukon.sk/api/files?id=${filename}`); setIsUrlCopied(false); })}
          >
            <a title="Upload" className={styles.uploadBtn} style={{ width: '100%' }}>
              <BiUpload size={20} />
              Nahráť súbor
            </a>
          </FileInput>
          {!!urlToCopy && (
            <div className={styles.urlToCopy}>
              <span>{urlToCopy}</span>
              <a onClick={() => { copyToClipboard(urlToCopy); setIsUrlCopied(true); }} title="Kopírovať">
                {!isUrlCopied ? <BsClipboard size={18} /> : <BsClipboardCheck size={18} color="#10b981" />}
              </a>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}