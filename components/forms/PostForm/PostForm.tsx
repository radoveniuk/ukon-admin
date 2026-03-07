import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BiUpload } from 'react-icons/bi';
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
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<Post>({ defaultValues: data });
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
          <button type="submit" disabled={!isEmpty(errors)} className={styles.submitBtn}>
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
                  <span>Názov článku</span>
                  <input type="text" {...register('name', { required: true })} />
                </label>
                <label>
                  <span>Dátum publikácie</span>
                  <input type="text" {...register('publicationDate', { required: true, value: getToday() })} />
                </label>
                <Controller
                  control={control}
                  name="lang"
                  render={({ field }) => (
                    <label>
                      <span>Jazyk</span>
                      <Select
                        options={LANGS.map((lg) => ({
                          value: lg,
                          text: lg.toUpperCase(),
                        }))}
                        onChange={({ value }) => {
                          field.onChange(value);
                        }}
                        value={field.value}
                      />
                    </label>
                  )}
                />
              </div>

              <div className={styles.col}>
                <Controller
                  control={control}
                  name="titleImgUrl"
                  render={({ field }) => (
                    <label>
                      <span>Obrázok</span>
                      <FileInput accept="image/*" id={'titleImgUrl'} onChange={(e) => void sendFile(e.target.files?.[0]).then((filename) => void field.onChange(filename))}>
                        <a title="Upload" className={styles.uploadBtn}>
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

              <div className={styles.col}>
                <label>
                  <span>Media</span>
                  <a className={styles.uploadBtn} onClick={() => void setOpenUploadMediaDialog(true)}>
                    <BiUpload size={20} />
                    Upload and get URL
                  </a>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.data}>
            <h3 className={styles.title}>SEO data</h3>
            <div className={styles.fields}>
              <div className={styles.col}>
                <label>
                  <span>Canonical URL (ak nie je duplicita = Slug URL)</span>
                  <input type="text" {...register('canonicalUrl', { required: true })} />
                </label>
                <label>
                  <span>Slug URL (https://ukon.sk/...)</span>
                  <input type="text" {...register('slugUrl', { required: true })} />
                </label>
                <label>
                  <span>Meta name (Založenie živnosti)</span>
                  <input type="text" {...register('metaName', { required: true })} />
                </label>
                <label>
                  <span>Tags</span>
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
              <div className={styles.col}>
                <label>
                  <span>Meta description (Popis stránky)</span>
                  <textarea {...register('metaDescription', { required: true })} />
                </label>
                <label>
                  <span>Meta keywords (živnosť, zivnost)</span>
                  <input type="text" {...register('metaKeywords', { required: true })} />
                </label>
                <label>
                  <span>Meta Hreflang (sk/uk/ru/en/de/hu/...)</span>
                  <input type="text" {...register('metaHreflang', { required: true })} />
                </label>
              </div>
            </div>
          </div>

          <div className={styles.contentTabs}>
            <h3 className={styles.title}>Obsah</h3>
            {allowRender && (
              <div className={styles.content}>
                <div className={`${styles.panel} ${activeTab === 'html' && styles.active}`}>
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
            )}
          </div>
        </div>
      </form>

      <Dialog visible={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Заголовок и описание */}
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e293b' }}>
              Vymazať článok
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
              Zadajte heslo pre vymazanie článku <strong style={{ color: '#1e293b' }}>{data?.name || 'tento článok'}</strong>. Táto akcia je nenávratná.
            </p>
          </div>

          {/* Поле ввода пароля */}
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

          {/* Кнопки */}
          {inputValue === '2024' && (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setOpenDeleteDialog(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
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