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
                      <textarea
                        value={field.value.join('\n')}
                        onChange={(e) => {
                          const tags = e.target.value.split('\n');
                          field.onChange(tags);
                        }}
                      />
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
              </div>
            </div>
            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <MonacoEditor
                  height="800px"
                  defaultLanguage="html"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(value).contentBlocks)));
                  }}
                  theme="vs-dark"
                  options={{
                    wordWrap: 'on',
                    formatOnPaste: true,
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
    </>  );
}